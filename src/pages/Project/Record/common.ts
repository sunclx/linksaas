import iconGitee from '@/assets/allIcon/icon-gitee.png';
// import iconGods from '@/assets/allIcon/icon-gods.png';
// import iconJenkins from '@/assets/allIcon/icon-jenkins.png';
// import iconGitTea from '@/assets/allIcon/icon-gittea.png';
// import iconJira from '@/assets/allIcon/icon-jira.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import iconApp from '@/assets/allIcon/logo.png';
import * as API from '@/api/events';

export const PLATFORM = {
  //0-99 app事件
  [0]: {
    title: 'linksaas',
    icon: iconApp,
  },
  [API.EVENT_TYPE_GITLAB]: {
    title: 'GitLab',
    icon: iconGitlab,
  },
  [API.EVENT_TYPE_GITEE]: {
    title: 'Gitee',
    icon: iconGitee,
  }
};
