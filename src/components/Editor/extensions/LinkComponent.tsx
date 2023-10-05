import React, { useEffect, useState } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useCommands } from '@remirror/react';
import type {
  LinkInfo,
  LinkChannelInfo,
  LinkTaskInfo,
  LinkBugInfo,
  LinkDocInfo,
  LinkExterneInfo,
  LinkRequirementInfo,
} from '@/stores/linkAux';
import { LINK_TARGET_TYPE } from '@/stores/linkAux';
import { useStores } from '@/hooks';
import { useHistory } from 'react-router-dom';
import { Popover } from 'antd';
import { request } from '@/utils/request';
import { get_channel } from '@/api/project_channel';
import { get as get_issue } from '@/api/project_issue';
import { get_doc_key } from '@/api/project_doc';
import { LinkOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { get_requirement } from '@/api/project_requirement';
import { get_session } from '@/api/user';

const Link: React.FC<{
  link: LinkInfo;
  canRemove: boolean;
  onClick: () => void;
  getPosition: () => number;
}> = ({ link, canRemove, onClick, getPosition }) => {
  const { deleteLink, insertText } = useCommands();
  const cancelLink = () => {
    deleteLink(getPosition());
    insertText(link.linkContent);
  };

  const [title, setTitle] = useState('');

  const loadData = async () => {
    if (title != '') {
      return;
    }
    const sessionId = await get_session();
    if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_CHANNEL) {
      const channelLink = link as unknown as LinkChannelInfo;
      const res = await request(
        get_channel(sessionId, channelLink.projectId, channelLink.channelId),
      );
      if (res) {
        setTitle('频道:' + res.info.basic_info.channel_name);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_REQUIRE_MENT) {
      const reqLink = link as unknown as LinkRequirementInfo;
      const res = await request(get_requirement({
        session_id: sessionId,
        project_id: reqLink.projectId,
        requirement_id: reqLink.requirementId,
      }));
      if (res) {
        setTitle('项目需求:' + res.requirement.base_info.title);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_TASK) {
      const taskLink = link as unknown as LinkTaskInfo;
      const res = await request(
        get_issue(sessionId, taskLink.projectId, taskLink.issueId),
      );
      if (res) {
        setTitle('任务:' + res.info.basic_info.title);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_BUG) {
      const bugLink = link as unknown as LinkBugInfo;
      const res = await request(get_issue(sessionId, bugLink.projectId, bugLink.issueId));
      if (res) {
        setTitle('缺陷:' + res.info.basic_info.title);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_DOC) {
      const docLink = link as unknown as LinkDocInfo;
      const res = await request(
        get_doc_key({
          session_id: sessionId,
          project_id: docLink.projectId,
          doc_space_id: '',
          doc_id: docLink.docId,
        }),
      );
      if (res) {
        setTitle('文档:' + res.doc_key.title);
      }
    } else if (link.linkTargeType == LINK_TARGET_TYPE.LINK_TARGET_EXTERNE) {
      const externLink = link as unknown as LinkExterneInfo;
      setTitle('外部链接:' + externLink.destUrl);
    }
  };

  return (
    <span
      onMouseOver={(e) => {
        e.stopPropagation();
        e.preventDefault();
        loadData();
      }}
    >
      <Popover
        content={
          <div style={{ padding: "5px 5px 5px 5px" }}>
            {title}
          </div>
        }
      >
        <span style={{ borderBottom: "1px solid blue", paddingLeft: "5px", paddingRight: "5px" }}>
          <LinkOutlined />
          <a
            onClick={(e) => {
              e.stopPropagation();
              e.stopPropagation();
              onClick();
            }}
          >
            {link.linkContent}
          </a>
          {canRemove && <CloseCircleOutlined style={{ cursor: "pointer", paddingLeft: "5px" }} onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            cancelLink();
          }} />}
        </span>
      </Popover>
    </span>
  );
};

export type EditLinkProps = NodeViewComponentProps & {
  link: LinkInfo;
};

export const EditLink: React.FC<EditLinkProps> = (props) => {
  useEffect(() => {
    props.updateAttributes({ link: props.link });
  }, []);

  return (
    <Link
      link={props.link}
      canRemove={true}
      onClick={() => { }}
      getPosition={props.getPosition as () => number}
    />
  );
};

export type ViewLinkProps = NodeViewComponentProps & {
  link: LinkInfo;
};

export const ViewLink: React.FC<ViewLinkProps> = (props) => {
  const linkAuxStore = useStores('linkAuxStore');
  const history = useHistory();

  return (
    <Link
      link={props.link}
      canRemove={false}
      onClick={() => {
        linkAuxStore.goToLink(props.link, history);
      }}
      getPosition={props.getPosition as () => number}
    />
  );
};
