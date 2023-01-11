module.exports = {
  SUCCESS: (title) => (title ? `${title} successfully` : "SUCCESS"),
  ERROR: "ERROR !!! Internal Server Error.",
  SOMETHING_WENT_WRONG: "SOMETHING_WENT_WRONG",
  CREATED: (title) => `${title} added successfully.`,
  UPDATED: (title) => `${title} updated successfully.`,
  DELETED: (title) => `${title} deleted successfully.`,
  NOT_FOUND: (title) => `${title} not found.`,
  EXISTS: (title) => `${title} already exists.`,
  NOT_EXISTS: (title) => `${title} does not exist.`,
  KEY: "Please provide a valid key.",
  CREDENTIALS_WRONG: "Your credentials are incorrect !",
};
