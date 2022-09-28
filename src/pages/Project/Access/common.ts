import iconGitee from '@/assets/allIcon/icon-gitee.png';
// import iconGods from '@/assets/allIcon/icon-gods.png';
// import iconJenkins from '@/assets/allIcon/icon-jenkins.png';
// import iconGitTea from '@/assets/allIcon/icon-gittea.png';
// import iconJira from '@/assets/allIcon/icon-jira.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import * as API from '@/api/external_events';

export const platform = [
  {
    title: 'GitLab',
    icon: iconGitlab,
    eventSource: API.EVENT_SOURCE_GITLAB,
  },
  {
    title: 'Gitee',
    icon: iconGitee,
    eventSource: API.EVENT_SOURCE_GITEE,
  },
];
