import { Router, Request, Response } from "express";
import { supabase } from "../config/supabase";

const router = Router();

// POST /api/bookings - create a booking
router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { spaceId, duration, driverEmail } = req.body as {
      spaceId: number;
      duration: string;
      driverEmail: string;
    };

    if (!spaceId || !duration || !driverEmail) {
      res.status(400).json({ message: "spaceId, duration, and driverEmail are required." });
      return;
    }

    // Verify space exists
    const { data: space } = await supabase
      .from("spaces")
      .select("id")
      .eq("id", spaceId)
      .single();

    if (!space) {
      res.status(404).json({ message: "Space not found" });
      return;
    }

    // Generate reference
    const reference = `WS-${Date.now().toString().slice(-6)}`;

    // Insert booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert([
        {
          reference,
          space_id: spaceId,
          driver_email: driverEmail,
          duration,
        },
      ])
      .select()
      .single();

    if (error || !booking) {
      console.error("Booking insert error:", error);
      res.status(500).json({ message: "Failed to create booking." });
      return;
    }

    // Update space availability to false
    await supabase
      .from("spaces")
      .update({ is_available: false })
      .eq("id", spaceId);

    res.json({
      success: true,
      bookingId: booking.reference,
      message: `Booking confirmed! Reference: ${booking.reference}`,
      spaceId: booking.space_id,
      duration: booking.duration,
      driverEmail: booking.driver_email,
      createdAt: booking.created_at,
    });
  } catch (err) {
    console.error("Booking exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings - list bookings
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*, spaces(name, address)");

    if (error) {
      console.error("Fetch bookings error:", error);
      res.status(500).json({ message: "Failed to fetch bookings" });
      return;
    }

    res.json({ bookings, message: "Bookings fetched from Supabase" });
  } catch (err) {
    console.error("Fetch bookings exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/owner/:ownerId - list bookings for a specific owner's spaces
router.get("/owner/:ownerId", async (req: Request, res: Response): Promise<void> => {
  try {
    const ownerId = parseInt(req.params.ownerId, 10);
    if (isNaN(ownerId)) {
      res.status(400).json({ message: "Invalid owner ID" });
      return;
    }

    // First fetch all spaces owned by the user
    const { data: spaces, error: spaceError } = await supabase
      .from("spaces")
      .select("id")
      .eq("owner_id", ownerId);

    if (spaceError) {
      console.error("Fetch owner spaces error:", spaceError);
      res.status(500).json({ message: "Failed to fetch spaces" });
      return;
    }

    if (!spaces || spaces.length === 0) {
      res.json({ bookings: [] });
      return;
    }

    const spaceIds = spaces.map(s => s.id);

    // Then fetch bookings for those spaces
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*, spaces(name, address, price)")
      .in("space_id", spaceIds);

    if (bookingsError) {
      console.error("Fetch owner bookings error:", bookingsError);
      res.status(500).json({ message: "Failed to fetch bookings" });
      return;
    }

    res.json({ bookings });
  } catch (err) {
    console.error("Fetch owner bookings exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/bookings/driver/:email - list bookings for a specific car owner (driver)
router.get("/driver/:email", async (req: Request, res: Response): Promise<void> => {
  try {
    const email = req.params.email;
    if (!email) {
      res.status(400).json({ message: "Invalid driver email" });
      return;
    }

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("*, spaces(name, address, price, image)")
      .eq("driver_email", email)
      .order("created_at", { ascending: false });

    if (bookingsError) {
      console.error("Fetch driver bookings error:", bookingsError);
      res.status(500).json({ message: "Failed to fetch bookings" });
      return;
    }

    res.json({ bookings });
  } catch (err) {
    console.error("Fetch driver bookings exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
