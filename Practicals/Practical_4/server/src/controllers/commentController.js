const prisma = require('../lib/prisma');

// GET all comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        video: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET comment by ID
exports.getCommentById = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        },
        video: true,
        likes: {
          include: {
            user: {
              select: {
                id: true,
                username: true
              }
            }
          }
        }
      }
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE comment
exports.createComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    if (!text || !videoId) {
      return res.status(400).json({ error: 'Text and videoId are required' });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        videoId: parseInt(videoId),
        userId: req.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE comment
exports.updateComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to update this comment' });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: parseInt(req.params.id) },
      data: { text },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE comment
exports.deleteComment = async (req, res) => {
  try {
    const comment = await prisma.comment.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }

    await prisma.comment.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.status(200).json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LIKE comment
exports.likeComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    const comment = await prisma.comment.findUnique({
      where: { id: commentId }
    });

    if (!comment) return res.status(404).json({ error: 'Comment not found' });

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId
        }
      }
    });

    if (existingLike) {
      return res.status(400).json({ error: 'Already liked this comment' });
    }

    const like = await prisma.commentLike.create({
      data: {
        userId: req.user.id,
        commentId
      }
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UNLIKE comment
exports.unlikeComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);

    const like = await prisma.commentLike.findUnique({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId
        }
      }
    });

    if (!like) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: req.user.id,
          commentId
        }
      }
    });

    res.status(200).json({ message: 'Like removed' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};