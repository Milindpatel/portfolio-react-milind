import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import BaseLayout from '../../components/layouts/BaseLayout';
import BasePage from '../../components/BasePage';
import withAuth from '../../components/withAuth';
import { createBlog } from '../../lib/api';

const SlateEditor = dynamic(() => import('../../components/slate-editor/Editor'), { ssr: false });

function BlogEditor({ auth }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [lockId] = useState(() => Math.floor(1000 + Math.random() * 9000));

  const save = async (story, heading) => {
    setIsSaving(true);
    try {
      const blog = await createBlog({ title: heading.title, subTitle: heading.subtitle, story }, lockId);
      toast.success('Blog saved!');
      router.push(`/blogs/edit/${blog._id}`);
    } catch (err) {
      toast.error(`Could not save: ${err.message}. Copy your progress and refresh the page.`);
      setIsSaving(false);
    }
  };

  return (
    <BaseLayout {...auth}>
      <BasePage containerClass="editor-wrapper" className="blog-editor-page">
        <SlateEditor isLoading={isSaving} save={save} />
      </BasePage>
    </BaseLayout>
  );
}

export default withAuth('siteOwner')(BlogEditor);
