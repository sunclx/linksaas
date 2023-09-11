import iconAtomgit from '@/assets/allIcon/icon-atomgit.png';
import iconGitee from '@/assets/allIcon/icon-gitee.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import * as API from '@/api/external_events';

export const platform = [
  {
    title: 'Atomgit',
    icon: iconAtomgit,
    eventSource: API.EVENT_SOURCE_ATOMGIT,
  },
  {
    title: 'Gitlab',
    icon: iconGitlab,
    eventSource: API.EVENT_SOURCE_GITLAB,
  },
  {
    title: 'Gitee',
    icon: iconGitee,
    eventSource: API.EVENT_SOURCE_GITEE,
  },
];
