import { useState } from 'react';
import { CodeBlockClient } from '@/components/code-block-client';
import { BsCopy, BsFile, BsFolder } from 'react-icons/bs';
import { cn } from '@repo/ui/lib/utils';
import { Button } from '@repo/ui/button';

const FileTreeItem = ({ item, activeFile, setActiveFile, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(true); // Folders are open by default
  const paddingLeft = `${depth * 1.5}rem`; // Indent based on depth
  const handleItemClick = () => {
    if (item.type === 'folder') {
      setIsOpen(!isOpen);
    } else {
      setActiveFile({
        ...item,
      }); // Set the active file's path
    }
  };

  const isFileActive = item.type === 'file' && activeFile === item.path;

  return (
    <div>
      <div
        className={cn(
          `flex items-center cursor-pointer py-1 px-2 rounded-md transition-colors duration-200`,
          isFileActive
            ? 'bg-blue-100 text-blue-800'
            : 'text-gray-700 hover:bg-gray-100',
        )}
        style={{ paddingLeft }}
        onClick={handleItemClick}
      >
        {item.type === 'folder' ? (
          <span className="mr-2">
            <BsFolder />
          </span>
        ) : (
          <span className="mr-2">
            <BsFile />
          </span>
        )}
        {item.name}
      </div>
      {item.type === 'folder' && isOpen && (
        <div className="pl-0">
          {item.children.map((child: any) => (
            <FileTreeItem
              key={child.path}
              item={child}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Helper function to flatten the file tree and add full paths
const flattenTree = (tree: any, parentPath = '') => {
  let flatTree: any[] = [];
  tree.forEach((item: any) => {
    const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
    const newItem = { ...item, path: currentPath };
    flatTree.push(newItem);
    if (item.type === 'folder' && item.children) {
      flatTree = flatTree.concat(flattenTree(item.children, currentPath));
    }
  });
  return flatTree;
};

export function CodeViewer() {
  const rawFileTree = [
    {
      name: 'app',
      type: 'folder',
      children: [
        { path: 'app/page.tsx', name: 'page.tsx', type: 'file' },
        { path: 'app/index.css', name: 'index.css', type: 'file' },
      ],
    },
    {
      name: 'package.json',
      type: 'file',
    },
  ];
  const [activeFile, setActiveFile] = useState<{
    name: string;
    path: string;
    type: 'file' | 'folder';
  }>({
    name: 'page.tsx',
    path: 'app/page.tsx',
    type: 'file',
  }); // Default to the first file
  // Flatten the tree and add 'path' property to each item
  const fileTreeWithPaths = flattenTree(rawFileTree).filter(
    (item) =>
      item.path.split('/').length === 1 ||
      (item.path.split('/').length === 2 && item.type === 'folder') ||
      (item.path.split('/').length === 3 && item.type === 'folder') ||
      item.type === 'file',
  );

  const codeMap: Record<string, string> = {
    'app/page.tsx': `'use client';
import { ShowcasePageReview, useShowcase } from '@reviewsup/embed-react';
import { ShowcaseConfig } from '@repo/api/showcases/entities/showcase.entity';
      
export default function Page() {
  const { showcase, error } = useShowcase(currentShowcaseId);
        
  if (!showcase) {
    return <div>Loading...</div>;
  }
        
  return (
    <>
      <ShowcasePageReview showcase={showcase} />
    </>
  );
}
 `,

    'app/index.css': `@import "@reviewsup/embed-react/styles.css";`,
  };
  const currentCode =
    codeMap[activeFile.path] || 'Select a file to view its code.';

  return (
    <div className="grid grid-cols-12 w-full h-full border border-gray-200 rounded-md min-h-[500px]">
      <div className="col-span-3">
        <p className="px-4 py-2">File</p>
        <div className="h-px bg-gray-200" />
        <nav className="px-4 py-2">
          {/* Render top-level items of the file tree */}
          {fileTreeWithPaths
            .filter((item) => item.path.split('/').length === 1) // Only show top-level items
            .map((item) => (
              <FileTreeItem
                key={item.path}
                item={item}
                activeFile={activeFile}
                setActiveFile={setActiveFile}
              />
            ))}
        </nav>
      </div>
      <div className="cols-span-9 w-full border-l border-gray-200">
        <div className="flex flex-row justify-between items-center">
          <p className="px-4 py-2 ">{activeFile.path}</p>
          <Button variant={'ghost'}>
            <BsCopy />
          </Button>
        </div>
        <div className="p-4">
          <CodeBlockClient lang={'tsx'}>{currentCode}</CodeBlockClient>
        </div>
      </div>
    </div>
  );
}
