import iconGitee from '@/assets/allIcon/icon-gitee.png';
import iconAtomgit from '@/assets/allIcon/icon-atomgit.png';
import iconGitlab from '@/assets/allIcon/icon-gitlab.png';
import iconApp from '@/assets/allIcon/logo.png';
import taskIcon from '@/assets/allIcon/icon-task.png';
import bugIcon from '@/assets/allIcon/icon-bug.png';
import spritIcon from '@/assets/allIcon/icon-sprit.png';
import docIcon from '@/assets/channel/doc@2x.png';
import appIcon from '@/assets/allIcon/icon-appstore.png';
import robotIcon from '@/assets/allIcon/icon-robot.png';
import repoIcon from '@/assets/allIcon/icon-repo.png';
import testcaseIcon from '@/assets/allIcon/icon-testcase.png';
import scriptIcon from '@/assets/allIcon/icon-script.png';
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
  [API.EVENT_TYPE_DISK]: {
    title: 'disk',
    icon: iconApp,
  },
  [API.EVENT_TYPE_APP]: {
    title: 'app',
    icon: appIcon,
  },
  [API.EVENT_TYPE_BOOK_SHELF]: {
    title: 'bookShelf',
    icon: iconApp,
  },
  [API.EVENT_TYPE_ROBOT]: {
    title: 'robot',
    icon: robotIcon,
  },
  [API.EVENT_TYPE_EARTHLY]: {
    title: 'repo',
    icon: repoIcon,
  },
  [API.EVENT_TYPE_TEST_CASE]: {
    title: 'testCase',
    icon: testcaseIcon,
  },
  [API.EVENT_TYPE_SCRIPT]: {
    title: 'script',
    icon: scriptIcon,
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
