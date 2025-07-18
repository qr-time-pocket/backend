import { Router } from "express";
import { container } from "tsyringe";
import { GroupService } from "../services/GroupService";

const router = Router();
const groupService = container.resolve(GroupService);

// GET /group
router.get("/", async (req, res) => {
  try {
    const result = await groupService.getAllGroups();
    res.json(result);
  } catch (error) {
    console.error("Get groups error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
  
// GET /group/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await groupService.getGroupById(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Get group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST /group
router.post("/", async (req, res) => {
  try {
    const { name, description, createdBy } = req.body;
    const result = await groupService.createGroup({
      name,
      description,
      createdBy,
    });
    res.json(result);
  } catch (error) {
    console.error("Create group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// PUT /group/:id
router.put("/:id", async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await groupService.updateGroup(req.params.id, {
      name,
      description,
    });
    res.json(result);
  } catch (error) {
    console.error("Update group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE /group/:id
router.delete("/:id", async (req, res) => {
  try {
    const result = await groupService.deleteGroup(req.params.id);
    res.json(result);
  } catch (error) {
    console.error("Delete group error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
