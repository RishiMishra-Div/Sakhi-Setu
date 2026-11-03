import { Product } from '../models/Product.js';
import { Member } from '../models/Member.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search, availability } = req.query;
    let query = {};

    if (category && category !== 'All' && category !== 'सर्व') {
      query.category = { $regex: category, $options: 'i' };
    }

    if (availability && availability !== 'all') {
      query.availability = availability;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { makerName: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, unit, imageUrl, makerName, memberId, contactPhone, availability, featured } = req.body;

    if (!name || !price || !description) {
      return res.status(400).json({ message: 'Product name, price, and description are required' });
    }

    const product = new Product({
      name,
      category: category || 'Food / खाद्यपदार्थ',
      description,
      price: Number(price),
      unit: unit || 'piece',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      makerName: makerName || 'सखी बचत गट सदस्य (Sakhi Member)',
      memberId: memberId || null,
      contactPhone: contactPhone || '9822012345',
      availability: availability || 'available',
      featured: Boolean(featured)
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create product', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

export const sendProductInquiry = async (req, res) => {
  try {
    const { productId, buyerName, buyerPhone, message, quantity } = req.body;

    if (!buyerName || !buyerPhone) {
      return res.status(400).json({ message: 'Name and phone number are required for inquiry' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // In production this could send an SMS/WhatsApp/Email to the maker.
    // For our app, return confirmed payload with WhatsApp direct link:
    const whatsappText = encodeURIComponent(
      `नमस्कार! मी SakhiSetu वर आपले उत्पादन "${product.name}" पाहिले. मला ${quantity || 1} नग ह्वे आहेत. कृपया तपशील सांगा. - ${buyerName} (${buyerPhone})`
    );
    const whatsappUrl = `https://wa.me/91${product.contactPhone.replace(/[^0-9]/g, '')}?text=${whatsappText}`;

    res.json({
      success: true,
      message: 'Inquiry registered successfully! You can also chat directly on WhatsApp.',
      whatsappUrl,
      details: {
        product: product.name,
        maker: product.makerName,
        phone: product.contactPhone,
        buyerName,
        quantity: quantity || 1
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to submit inquiry', error: error.message });
  }
};
