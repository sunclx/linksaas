import iconGitee from '@/assets/allIcon/icon-gitee.png';
import iconAtomgit from '@/assets/allIcon/icon-atomgit.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import iconApp from '@/assets/allIcon/logo.png';
import taskIcon from '@/assets/allIcon/icon-task.png';
import bugIcon from '@/assets/allIcon/icon-bug.png';
import spritIcon from '@/assets/allIcon/icon-sprit.png';
import docIcon from '@/assets/channel/doc@2x.png';
import cicdIcon from '@/assets/allIcon/icon-cicd.png';
import reqIcon from '@/assets/allIcon/icon-req.png';
import ideaIcon from '@/assets/allIcon/icon-idea.png';
import apiCollIcon from '@/assets/allIcon/icon-apicoll.png';
import dataAnnoIcon from '@/assets/allIcon/icon-dataanno.png';


import * as API from '@/api/events';

export const EVENT_ICON_LIST = {
  [0]: {
    title: 'linksaas',
    icon: iconApp,
  },
  [API.EVENT_TYPE_PROJECT]: {
    title: 'linksaas',
    icon: iconApp,
  },
  [API.EVENT_TYPE_TASK]: {
    title: 'task',
    icon: taskIcon,
  },
  [API.EVENT_TYPE_BUG]: {
    title: 'bug',
    icon: bugIcon,
  },
  [API.EVENT_TYPE_SPRIT]: {
    title: 'sprit',
    icon: spritIcon,
  },
  [API.EVENT_TYPE_DOC]: {
    title: 'doc',
    icon: docIcon,
  },
  [API.EVENT_TYPE_CICD]: {
    title: 'cicd',
    icon: cicdIcon,
  },
  [API.EVENT_TYPE_DISK]: {
    title: 'disk',
    icon: iconApp,
  },
  [API.EVENT_TYPE_REQUIRE_MENT]: {
    title: 'requirement',
    icon: reqIcon,
  },
  [API.EVENT_TYPE_CODE]: {
    title: 'linksaas',
    icon: iconApp,
  },
  [API.EVENT_TYPE_IDEA]: {
    title: 'idea',
    icon: ideaIcon,
  },
  [API.EVENT_TYPE_GITLAB]: {
    title: 'GitLab',
    icon: iconGitlab,
  },
  [API.EVENT_TYPE_GITEE]: {
    title: 'Gitee',
    icon: iconGitee,
  },
  [API.EVENT_TYPE_DATA_ANNO]: {
    title: 'DataAnno',
    icon: dataAnnoIcon,
  },
  [API.EVENT_TYPE_API_COLLECTION]: {
    title: 'ApiCollection',
    icon: apiCollIcon,
  },
  [API.EVENT_TYPE_CUSTOM_EVENT]: {
    title: 'CustomEvent',
    icon: iconApp,
  },
  [API.EVENT_TYPE_ATOMGIT]: {
    title: "Atomgit",
    icon: iconAtomgit,
  }
};
