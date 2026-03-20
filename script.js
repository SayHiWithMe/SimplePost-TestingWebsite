// Mock data for initial view
let posts = [
    {
        id: 1,
        user: "SayHiWithMe",
        content: "Welcome to SimplePost! Building this with clean code.",
        likes: 12,
        comments: 2
    }
];

const feedContainer = document.getElementById('feedContainer');
const postBtn = document.getElementById('submitPost');
const postInput = document.getElementById('postInput');

// Function to render posts
function renderPosts() {
    feedContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class="post-user">@${post.user}</div>
            <div class="post-content">${post.content}</div>
            <div class="post-actions">
                <span onclick="likePost(${post.id})">❤️ ${post.likes}</span>
                <span>💬 ${post.comments}</span>
            </div>
        `;
        feedContainer.prepend(postElement);
    });
}

// Handle new post
postBtn.addEventListener('click', () => {
    const content = postInput.value.trim();
    if (content) {
        const newPost = {
            id: Date.now(),
            user: "SayHiWithMe",
            content: content,
            likes: 0,
            comments: 0
        };
        posts.push(newPost);
        postInput.value = '';
        renderPosts();
    }
});

// Simple like function
window.likePost = (id) => {
    const post = posts.find(p => p.id === id);
    if (post) {
        post.likes++;
        renderPosts();
    }
};

// Initial render
renderPosts();
