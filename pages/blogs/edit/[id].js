import { useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'react-toastify';
import BaseLayout from '../../../components/layouts/BaseLayout';
import BasePage from '../../../components/BasePage';
import withAuth from '../../../components/withAuth';
import { getBlogById, updateBlog } from '../../../lib/api';

const SlateEditor = dynamic(() => import('../../../components/slate-editor/Editor'), { ssr: false });

function BlogEditorUpdate({ blog, auth }) {
  const [isSaving, setIsSaving] = useState(false);

  if (!blog) {
    return (
      <BaseLayout {...auth}>
        <BasePage title="Post not found" />
      </BaseLayout>
    );
  }

  const save = async (story, heading) => {
    setIsSaving(true);
    try {
      await updateBlog({ title: heading.title, subTitle: heading.subtitle, story }, blog._id);
      toast.success('Blog saved!');
    } catch (err) {
      toast.error(`Could not save: ${err.message}. Copy your progress and refresh the page.`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseLayout {...auth}>
      <BasePage containerClass="editor-wrapper" className="blog-editor-page">
        <SlateEditor initialValue={blog.story} isLoading={isSaving} save={save} />
      </BasePage>
    </BaseLayout>
  );
}

BlogEditorUpdate.getInitialProps = async ({ query, req }) => {
  try {
    return { blog: await getBlogById(query.id, req) };
  } catch {
    return { blog: null };
  }
};

export default withAuth('siteOwner')(BlogEditorUpdate);
