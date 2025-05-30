import { getClassNameAndIcon } from '@/features/class/util/get-class-name';
import generatePastelColor from '@/utils/generate-pastel-color';
import IconButton from './icon-button';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
interface ClassButtonProps {
  workspace_id: string;
  class_name: string;
  onClick: (workspace_id: string) => void;
  isActive: boolean;
}

export default function ClassButton({ workspace_id, class_name, isActive, onClick }: ClassButtonProps) {
  const pathname = usePathname();
  const [ExtractEmoji, extractTitle] = getClassNameAndIcon(class_name);
  const color = generatePastelColor(workspace_id);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <IconButton
      _hover={{ opacity: pathname.includes(workspace_id) ? 1 : 0.6 }}
      style={{
        color: isActive ? 'white' : isHovered ? 'white' : color,
        backgroundColor: isActive ? color : isHovered ? color : '#F3F3F3',
      }}
      onClick={() => {
        onClick(workspace_id);
      }}
      icon={<ExtractEmoji strokeWidth={2} />}
      text={extractTitle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    />
  );
}
