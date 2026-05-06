import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";

const router = Router();

// GET /api/spaces - list all spaces with optional search
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const search = (req.query.search as string | undefined)?.toLowerCase() ?? "";
    
    let query = supabase.from("spaces").select(`
      *,
      owner:users (
        name,
        phone,
        email
      )
    `);
    
    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
    }

    const { data: spaces, error } = await query;

    if (error) {
      console.error("Fetch spaces error:", error);
      res.status(500).json({ message: "Failed to fetch spaces" });
      return;
    }

    res.json(spaces);
  } catch (err) {
    console.error("Fetch spaces exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/spaces/my-spaces/:ownerId
router.get("/my-spaces/:ownerId", async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = parseInt(String(req.params.ownerId), 10);
    
    if (isNaN(ownerId)) {
      res.status(400).json({ message: "Invalid owner ID" });
      return;
    }

    const { data: spaces, error } = await supabase
      .from("spaces")
      .select("*")
      .eq("owner_id", ownerId);

    if (error) {
      console.error("Fetch my spaces error:", error);
      res.status(500).json({ message: "Failed to fetch spaces" });
      return;
    }

    res.json(spaces);
  } catch (err) {
    console.error("Fetch my spaces exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/spaces/:id - get one space + its owner
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(String(req.params.id), 10);
    
    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid space ID" });
      return;
    }

    const { data: space, error: spaceError } = await supabase
      .from("spaces")
      .select("*")
      .eq("id", id)
      .single();

    if (spaceError || !space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    let owner = null;
    if (space.owner_id) {
      const { data: ownerData } = await supabase
        .from("users")
        .select("id, name, phone, email") // Exclude password
        .eq("id", space.owner_id)
        .single();
      
      if (ownerData) {
        owner = {
          id: ownerData.id,
          name: ownerData.name,
          phone: ownerData.phone,
          email: ownerData.email,
          rating: 4.8, // Default rating as mock didn't persist ratings
          spaceId: space.id
        };
      }
    }

    res.json({ space, owner });
  } catch (err) {
    console.error("Fetch space exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/spaces - add a new space
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, address, price, type, owner_id } = req.body;

    if (!name || !address || !price || !type || !owner_id) {
      res.status(400).json({ message: "Missing required fields." });
      return;
    }

    // Insert space (mocking lat/lng and image for now as AddSpace doesn't provide them)
    const { data: space, error } = await supabase.from("spaces").insert([
      {
        name,
        address,
        price: Number(price),
        type,
        owner_id: Number(owner_id),
        lat: 13.0827, // Mocked lat (Chennai)
        lng: 80.2707, // Mocked lng (Chennai)
        image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&q=80&w=2000" // Mock image
      },
    ]).select().single();

    if (error) {
      console.error("Add space error:", error);
      res.status(500).json({ message: "Failed to add space." });
      return;
    }

    res.json({ success: true, space });
  } catch (err) {
    console.error("Add space exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
