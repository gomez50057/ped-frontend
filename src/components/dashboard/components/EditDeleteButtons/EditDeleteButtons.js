const EditDeleteButtons = ({ onEdit, onDelete }) => (
  <>
    <button onClick={onEdit}>✏️</button>
    <button onClick={onDelete}>❌</button>
  </>
);

export default EditDeleteButtons;
