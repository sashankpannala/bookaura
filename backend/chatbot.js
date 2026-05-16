// Chatbot knowledge base with answers about books and policies
const knowledgeBase = {
  // Book-related keywords
  books: [
    { keywords: ['book recommendation', 'suggest', 'best book', 'popular book'], response: 'We have an amazing collection of bestsellers, fiction, non-fiction, romance, mystery, and sci-fi books. What genre are you interested in? You can browse our full collection on the home page!' },
    { keywords: ['fiction', 'novel', 'story'], response: 'Our fiction collection includes contemporary novels, classics, historical fiction, and more. Visit our home page to explore all available titles.' },
    { keywords: ['price', 'cost', 'how much'], response: 'Book prices vary depending on the title and edition. You can view prices directly on each book card in our store. We offer competitive pricing and regular discounts!' },
    { keywords: ['author', 'writer'], response: 'We carry books from both renowned and emerging authors. You can search by author or browse by genre on our platform.' },
    { keywords: ['new books', 'latest', 'recently added'], response: 'Check out our home page for the latest additions to our collection. We regularly add new titles to keep our inventory fresh!' },
  ],
  
  // Policy-related keywords
  shipping: [
    { keywords: ['shipping', 'delivery', 'ship', 'deliver', 'how long'], response: 'We offer standard and express shipping options:\n• Standard Delivery: 5-7 business days (Free for orders over $50)\n• Express Delivery: 2-3 business days (Additional fee applies)\n\nDelivery times may vary based on your location.' },
    { keywords: ['free shipping', 'shipping cost', 'shipping fee'], response: 'Free standard shipping on orders over $50! For smaller orders, shipping fees apply. Express delivery has an additional charge. Shipping costs are calculated at checkout.' },
    { keywords: ['international shipping', 'ship abroad', 'worldwide'], response: 'Currently, we offer shipping within the continental areas. International shipping options may be available for select countries. Please contact our support team for more details.' },
    { keywords: ['tracking', 'where is my order', 'track order'], response: 'Once your order ships, you\'ll receive a tracking number via email. You can use this number to track your package in real-time from our website.' },
  ],

  returns: [
    { keywords: ['refund', 'return', 'money back', 'exchange'], response: 'We accept returns within 30 days of purchase for books in original, unread condition. For damaged or defective items, we offer replacements or refunds. Please contact our support team to initiate a return.' },
    { keywords: ['damaged book', 'defective', 'problem'], response: 'If your book arrives damaged or defective, please contact us immediately with photos. We\'ll replace it or issue a full refund at no cost to you. Your satisfaction is our priority!' },
    { keywords: ['return policy', 'return window'], response: 'Our return policy:\n• 30-day return window from purchase date\n• Books must be unread and in original condition\n• Free returns for damaged items\n• Full refund or exchange available\n\nContact support to initiate a return!' },
  ],

  payment: [
    { keywords: ['payment', 'pay', 'checkout', 'credit card', 'debit card'], response: 'We accept all major payment methods:\n• Credit cards (Visa, MasterCard, American Express)\n• Debit cards\n• Digital wallets\n• Bank transfers (in select regions)\n\nYour payment information is secure and encrypted.' },
    { keywords: ['secure', 'safe', 'security', 'ssl', 'encryption'], response: 'Your payment and personal information are fully protected with industry-standard SSL encryption. BookAura is PCI-DSS compliant and your data is never shared with third parties without consent.' },
    { keywords: ['promo code', 'coupon', 'discount code', 'sale'], response: 'We regularly offer promotional codes and discounts! Sign up for our newsletter to receive exclusive deals. Check our homepage for current promotions and special offers.' },
  ],

  account: [
    { keywords: ['account', 'profile', 'change password', 'update info'], response: 'You can manage your account settings by logging in and visiting your profile page. There you can:\n• Update personal information\n• Change your password\n• View order history\n• Manage addresses\n\nNeed help? Contact our support team!' },
    { keywords: ['create account', 'sign up', 'register'], response: 'Creating an account is easy! Click on "Sign Up" and fill in your details. You\'ll instantly get access to:\n• Order history\n• Saved addresses\n• Wishlist\n• Faster checkout\n\nSign up today to start shopping!' },
    { keywords: ['forgot password', 'reset password'], response: 'Click on "Forgot Password" on the login page and enter your email. You\'ll receive a password reset link. Follow the instructions to create a new password. If you don\'t receive the email, check your spam folder!' },
  ],

  general: [
    { keywords: ['help', 'support', 'contact'], response: 'Need help? We\'re here to assist!\n• Email: support@bookaura.com\n• Chat: Use this chatbot for quick questions\n• FAQ: Check our FAQ page for common questions\n\nOur team typically responds within 24 hours.' },
    { keywords: ['customer service', 'contact us'], response: 'Our customer service team is available to help with any questions or concerns. You can reach us through:\n• Email: support@bookaura.com\n• Live chat (on our website)\n• Phone support for urgent matters' },
    { keywords: ['about', 'company', 'bookaura'], response: 'BookAura is your premium online bookstore, dedicated to bringing quality literature to readers everywhere. We pride ourselves on:\n• Wide selection of books\n• Competitive prices\n• Fast shipping\n• Excellent customer service' },
  ]
};

// Function to find matching response based on user query
function findResponse(userQuery) {
  const query = userQuery.toLowerCase();
  
  // Flatten knowledge base and search
  const allItems = [
    ...knowledgeBase.books,
    ...knowledgeBase.shipping,
    ...knowledgeBase.returns,
    ...knowledgeBase.payment,
    ...knowledgeBase.account,
    ...knowledgeBase.general
  ];

  // Find best match based on keyword presence
  for (const item of allItems) {
    if (item.keywords.some(keyword => query.includes(keyword))) {
      return item.response;
    }
  }

  // If no exact match, provide a helpful default response
  return "I'm sorry, I didn't quite understand your question. I can help with:\n• 📚 Book recommendations and information\n• 📦 Shipping and delivery\n• 💳 Payment and pricing\n• 🔄 Returns and refunds\n• 👤 Account management\n• 💬 General customer service\n\nPlease feel free to ask again or contact our support team directly!";
}

module.exports = {
  knowledgeBase,
  findResponse
};
