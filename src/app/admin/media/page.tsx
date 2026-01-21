import { Image, UploadCloud } from 'lucide-react';
import Link from 'next/link';

export default function MediaAdminPage() {
  // Dummy media items for UI demo
  const mediaItems = [
    {
      id: 1,
      name: 'sample-image.jpg',
      url: '/media/sample-image.jpg',
      type: 'image',
      uploaded: '2026-01-18',
    },
    {
      id: 2,
      name: 'logo.png',
      url: '/media/logo.png',
      type: 'image',
      uploaded: '2026-01-17',
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Image className="w-6 h-6 text-blue-600" /> Media Library
        </h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          <UploadCloud className="w-5 h-5" /> Upload New
        </button>
      </div>
      <div className="bg-white border rounded shadow-sm p-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2">Preview</th>
              <th className="text-left py-2 px-2">File</th>
              <th className="text-left py-2 px-2">Type</th>
              <th className="text-left py-2 px-2">Uploaded</th>
              <th className="text-left py-2 px-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mediaItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-2">
                  <img src={item.url} alt={item.name} className="w-12 h-12 object-cover rounded border" />
                </td>
                <td className="py-2 px-2 font-medium">{item.name}</td>
                <td className="py-2 px-2 capitalize">{item.type}</td>
                <td className="py-2 px-2">{item.uploaded}</td>
                <td className="py-2 px-2">
                  <Link href={item.url} target="_blank" className="text-blue-600 hover:underline mr-2">View</Link>
                  <button className="text-red-600 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {mediaItems.length === 0 && (
          <div className="text-center text-gray-500 py-8">No media files found.</div>
        )}
      </div>
    </div>
  );
}
