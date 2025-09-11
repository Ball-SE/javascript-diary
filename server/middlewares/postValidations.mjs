export function postValidations(req, res, next) {
  const { title, image, category_id, description, content, status_id } = req.body;

  if(!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({ message: "Title is required and must be a string" });
    }
  if(!image || typeof image !== 'string' || image.trim().length === 0) {
    return res.status(400).json({ message: "Image is required and must be a string" });
  }
  if(!category_id || typeof category_id !== 'number') {
    return res.status(400).json({ message: "Category ID is required and must be a number" });
  }
  if(!description || typeof description !== 'string' || description.trim().length === 0) {
    return res.status(400).json({ message: "Description is required and must be a string" });
  }
  if(!content || typeof content !== 'string' || content.trim().length === 0) {
    return res.status(400).json({ message: "Content is required and must be a string" });
  }
  if(!status_id || typeof status_id !== 'number') {
    return res.status(400).json({ message: "Status ID is required and must be a number" });
  }
  next();
}