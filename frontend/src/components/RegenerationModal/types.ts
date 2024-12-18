export interface RegenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void> | void;
  title?: string;
  isLoading?: boolean;
}