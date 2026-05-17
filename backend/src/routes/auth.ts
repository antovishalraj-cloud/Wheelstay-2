import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { supabase } from "../config/supabase";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address, password, role } = req.body as {
      name: string;
      email: string;
      phone: string;
      address: string;
      password: string;
      role?: string;
    };

    if (!name || !email || !phone || !address || !password) {
      res.status(400).json({ message: "All fields are required." });
      return;
    }

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists." });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user
    const { error } = await supabase.from("users").insert([
      {
        name,
        email,
        password: hashedPassword,
        phone,
        address,
        role: role || "driver",
      },
    ]);

    if (error) {
      console.error("Register error:", error);
      res.status(500).json({ message: "Failed to register user." });
      return;
    }

    res.json({ success: true, message: "Registration successful", redirect: "/login" });
  } catch (err) {
    console.error("Register exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, role } = req.body as {
      email: string;
      password: string;
      role: "owner" | "driver";
    };

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    // Fetch user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password." });
      return;
    }

    // Always use the role stored in the database — ignore what the frontend tab says.
    // This prevents login failure when a user picks the wrong tab.
    const assignedRole = user.role || "driver";

    const redirect = assignedRole === "owner" ? "/myprofile" : "/cardetails";
    res.json({ success: true, role: assignedRole, redirect, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address, avatar_url: user.avatar_url } });
  } catch (err) {
    console.error("Login exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/auth/profile/:id
router.put("/profile/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const { avatar_url } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const { error } = await supabase
      .from("users")
      .update({ avatar_url })
      .eq("id", id);

    if (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Failed to update profile" });
      return;
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (err) {
    console.error("Profile update exception:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
