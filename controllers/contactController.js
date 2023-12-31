const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactSchema");
const { constants } = require("../constants");

//@desc Get all contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({ user_id: req.user.id });
  res.status(constants.OK).json(contacts);
});

//@desc create contact
//@route POST /api/contacts
//@access private

const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(constants.VALIDATION_ERROR);
    throw new Error("All fields are mandatory");
  }
  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id,
  });
  res.status(constants.CREATED).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }
  res.status(constants.OK).json(contact);
});

//@desc update contact
//@route PUT /api/contacts/:id
//@access private

const updateContact = asyncHandler(async (req, res) => {
  const { params, body } = req;
  const { id } = params;

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Operation not authorized");
  }

  const updatedContact = await Contact.findByIdAndUpdate(id, body, {
    new: true,
  });
  res.status(constants.OK).json(updatedContact);
});

//@desc delete contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const contact = await Contact.findById(id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("Contact not found");
  }

  if (contact.user_id.toString() !== req.user.id) {
    res.status(constants.UNAUTHORIZED);
    throw new Error("Operation not authorized");
  }

  await Contact.deleteOne({ _id: id });
  res.status(constants.OK).json(contact);
});

module.exports = {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
};
