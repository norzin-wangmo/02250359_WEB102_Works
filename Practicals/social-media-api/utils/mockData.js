const users = [
  {
    id: "1",
    username: "traveler",
    email: "traveler@example.com",
    full_name: "Karma",
    profile_picture: "default-profile.jpg",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: "2",
    username: "foodie",
    email: "foodie@example.com",
    full_name: "Sonam",
    profile_picture: "default-profile.jpg",
    bio: "Food lover",
    created_at: "2023-02-10"
  }
];

const posts = [
  {
    id: "1",
    caption: "Beautiful sunset",
    image: "sunset.jpg",
    user_id: "1",
    created_at: "2023-03-01"
  },
  {
    id: "2",
    caption: "Tasty dinner",
    image: "dinner.jpg",
    user_id: "2",
    created_at: "2023-03-02"
  }
];

const comments = [];
const likes = [];
const followers = [];

module.exports = {
  users,
  posts,
  comments,
  likes,
  followers
};