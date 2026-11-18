'use client';

import { useEffect, useState } from 'react';
import ProjectDetail from '@/components/editorial/ProjectDetail';
import type { Project } from '@/lib/content-types';

export default function Preview({ projects }: { projects: Project[] }) {
  const [project, setProject] = useState<Project>();
  useEffect(() => {
    if (window.parent === window) return;
    const origin = window.location.origin;
    function receive(event: MessageEvent) {
      if (event.origin === origin && event.source === window.parent && event.data?.type === 'wdp:portfolio-preview') {
        setProject(event.data.project);
      }
    }
    window.addEventListener('message', receive);
    window.parent.postMessage({ type: 'wdp:portfolio-preview-ready' }, origin);
    return () => window.removeEventListener('message', receive);
  }, []);

  if (!project) return <p style={{ padding: 32 }}>Sanity Studio에서 프로젝트를 열어 상세 미리보기를 확인하세요.</p>;
  const related = projects.filter(item => item._id !== project._id && (!project.related?.length || project.related.includes(item._id)));
  return <div onClick={event => {
    if (event.target instanceof Element && event.target.closest('a')) event.preventDefault();
  }}>
    <ProjectDetail project={project} related={related} preview />
  </div>;
}
