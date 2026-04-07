const users = [
  {
    id: "1",
    username: "traveler",
    email: "traveler@example.com",
    full_name: "Karma",
    profile_picture: "https://example.com/profiles/traveler.jpg",
    bio: "Travel photographer",
    created_at: "2023-01-15"
  },
  {
    id: "2",
    username: "foodie",
    email: "foodie@example.com",
    full_name: "Sonam",
    profile_picture: "https://example.com/profiles/foodie.jpg",
    bio: "Food lover",
    created_at: "2023-02-10"
  }
];

const posts = [
  {
    id: "1",
    caption: "Beautiful mountain view",
    image: "https://example.com/posts/mountain.jpg",
    user_id: "1",
    created_at: "2023-03-01"
  },
  {
    id: "2",
    caption: "Best noodles in town",
    image: "https://example.com/posts/noodles.jpg",
    user_id: "2",
    created_at: "2023-03-05"
  }
];

module.exports = { users, posts };