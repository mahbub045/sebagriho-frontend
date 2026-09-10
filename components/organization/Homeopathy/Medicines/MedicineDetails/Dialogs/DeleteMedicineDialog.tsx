export interface DeleteMedicineDialogProps {
  isOpen: boolean;
  onClose: () => void;
  medicineUid: string;
  medicineName?: string;
}
const DeleteMedicineDialog: React.FC<DeleteMedicineDialogProps> = ({
  isOpen,
  onClose,
  medicineUid,
  medicineName,
}) => {
  return <div>{/* JSX here */}</div>;
};

export default DeleteMedicineDialog;
