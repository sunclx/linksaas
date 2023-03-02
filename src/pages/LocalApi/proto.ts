export const PROTO = `openapi: 3.0.0
info:
  version: 0.1.8
  title: local-api
  description: local api for linksaas desktop
  contact:
    name: linksaas
    email: panleiming@linksaas.pro
    url: https://jihulab.com/linksaas/local-api
servers:
  - url: http://localhost:__PORT__
tags:
  - name: global
    description: 不属于项目范围的接口
  - name: projectCreate
    description: 项目中创建任务/缺陷和文档
  - name: projectTask
    description: 项目中任务相关接口
  - name: projectBug
    description: 项目中缺陷相关接口
  - name: projectEvent
    description: 项目中事件相关接口
  - name: projectMember
    description: 项目中成员相关接口
  - name: projectDoc
    description: 项目中文档相关接口
  - name: projectChannel
    description: 项目中的沟通频道
  - name: projectTestCase
    description: 项目中的测试用例
  - name: projectCodeComment
    description: 项目中的代码评论
paths:
  /hello:
    get:
      tags:
        - global
      summary: 握手协议
      description: 检查是否linksaas desktop的本地接口服务
      operationId: helloGet
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            text/plain:
              schema:
                type: string
                example: hello linksaas
  /project/{projectId}/bug/all:
    get:
      tags:
        - projectBug
      summary: 所有缺陷
      description: 列出所有缺陷
      operationId: projectProjectIdBugAllGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
        - $ref: '#/components/parameters/Offset'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalCount:
                    type: integer
                    description: 缺陷总数量
                  bugList:
                    type: array
                    items:
                      $ref: '#/components/schemas/BugInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/bug/my:
    get:
      tags:
        - projectBug
      summary: 指派给我的缺陷
      description: 列出指派给我的缺陷
      operationId: projectProjectIdBugMyGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
        - name: state
          in: query
          required: true
          schema:
            type: string
            description: 缺陷状态
            default: all
            enum:
              - all
              - closed
              - unclose
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/BugInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/bug/record/{bugId}/events:
    get:
      tags:
        - projectBug
      summary: 缺陷相关事件
      description: 列出缺陷相关事件
      operationId: projectProjectIdBugRecordBugIdEventsGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/BugId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EventInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/bug/record/{bugId}/shortNote:
    get:
      tags:
        - projectBug
      summary: 便签方式显示缺陷
      description: 便签方式显示缺陷
      operationId: projectProjectIdBugRecordBugIdShortNoteGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/BugId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/bug/record/{bugId}/show:
    get:
      tags:
        - projectBug
      summary: 显示缺陷
      description: 显示缺陷
      operationId: projectProjectIdBugRecordBugIdShowGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/BugId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/channel/msg/{channelId}:
    get:
      tags:
        - projectChannel
      summary: 列出沟通内容
      description: 列出沟通内容(从后往前)
      operationId: projectProjectIdChannelMsgChannelIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/ChannelId'
        - $ref: '#/components/parameters/AccessToken'
        - $ref: '#/components/parameters/Limit'
        - name: refMsgId
          in: query
          schema:
            type: string
            description: 相关消息ID，空表示最后一条消息
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/MsgInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/channel/my:
    get:
      tags:
        - projectChannel
      summary: 我的沟通频道
      description: 列出我的沟通频道
      operationId: projectProjectIdChannelMyGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChannelInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/channel/notJoin:
    get:
      tags:
        - projectChannel
      summary: 我未加入的频道
      description: 列出我未加入的频道(需要管理员权限)
      operationId: projectProjectIdChannelNotJoinGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChannelInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/channel/orphan:
    get:
      tags:
        - projectChannel
      summary: 孤儿频道
      description: 列出孤儿频道
      operationId: projectProjectIdChannelOrphanGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/ChannelInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/codeComment/{commentThreadId}:
    get:
      tags:
        - projectCodeComment
      summary: 列出代码评论
      description: 列出代码评论
      operationId: projectProjectIdCodeCommentCommentThreadIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/CommentThreadId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/CodeCommentInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
    put:
      tags:
        - projectCodeComment
      summary: 新增代码评论
      description: 新增代码评论
      operationId: projectProjectIdCodeCommentCommentThreadIdPut
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/CommentThreadId'
        - $ref: '#/components/parameters/AccessToken'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                contentType:
                  type: string
                  description: 内容类型
                  enum:
                    - text
                    - markdown
                content:
                  type: string
                  description: 内容
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  commentId:
                    type: string
                    description: 代码评论ID
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/codeComment/{commentThreadId}/{commentId}:
    delete:
      tags:
        - projectCodeComment
      summary: 删除代码评论
      description: 删除代码评论
      operationId: projectProjectIdCodeCommentCommentThreadIdCommentIdDelete
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/CommentThreadId'
        - $ref: '#/components/parameters/CommentId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
    get:
      tags:
        - projectCodeComment
      summary: 获取单个代码评论
      description: 获取单个代码评论
      operationId: projectProjectIdCodeCommentCommentThreadIdCommentIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/CommentThreadId'
        - $ref: '#/components/parameters/CommentId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/CodeCommentInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
    post:
      tags:
        - projectCodeComment
      summary: 更新单个代码评论
      description: 更新单个代码评论
      operationId: projectProjectIdCodeCommentCommentThreadIdCommentIdPost
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/CommentThreadId'
        - $ref: '#/components/parameters/CommentId'
        - $ref: '#/components/parameters/AccessToken'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                contentType:
                  type: string
                  description: 内容类型
                  enum:
                    - text
                    - markdown
                content:
                  type: string
                  description: 内容
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/create/bug:
    get:
      tags:
        - projectCreate
      summary: 创建缺陷
      description: 创建缺陷
      operationId: projectProjectIdCreateBugGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/create/doc/{docSpaceId}:
    get:
      tags:
        - projectCreate
      summary: 创建文档
      description: 创建文档
      operationId: projectProjectIdCreateDocDocSpaceIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/DocSpaceId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/create/task:
    get:
      tags:
        - projectCreate
      summary: 创建任务
      description: 创建任务
      operationId: projectProjectIdCreateTaskGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/docSpace:
    get:
      tags:
        - projectDoc
      summary: 文档空间列表
      description: 列出文档空间列表
      operationId: projectProjectIdDocSpaceGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/DocSpaceInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/docSpace/{docSpaceId}:
    get:
      tags:
        - projectDoc
      summary: 文档列表
      description: 列出文档列表
      operationId: projectProjectIdDocSpaceDocSpaceIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/DocSpaceId'
        - $ref: '#/components/parameters/AccessToken'
        - $ref: '#/components/parameters/Offset'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalCount:
                    type: integer
                    description: 文档总数量
                  docList:
                    type: array
                    items:
                      $ref: '#/components/schemas/DocInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/docSpace/{docSpaceId}/{docId}/show:
    get:
      tags:
        - projectDoc
      summary: 查看文档
      description: 查看文档
      operationId: projectProjectIdDocSpaceDocSpaceIdDocIdShowGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/DocSpaceId'
        - $ref: '#/components/parameters/DocId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/event:
    get:
      tags:
        - projectEvent
      summary: 事件列表
      description: 列出事件列表
      operationId: projectProjectIdEventGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
        - name: fromTime
          in: query
          required: true
          schema:
            type: integer
            format: int64
            description: 开始时间，1970年以来的毫秒数
        - name: toTime
          in: query
          required: true
          schema:
            type: integer
            format: int64
            description: 结束时间，1970年以来的毫秒数
        - name: userId
          in: query
          schema:
            type: string
            description: 非空表示只显示对应用户事件，空表示所有用户
        - $ref: '#/components/parameters/Offset'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalCount:
                    type: integer
                    description: 事件总数量
                  eventList:
                    type: array
                    items:
                      $ref: '#/components/schemas/EventInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/member:
    get:
      tags:
        - projectMember
      summary: 项目成员列表
      description: 列出项目成员列表
      operationId: projectProjectIdMemberGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SimpleMemberInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/member/{memberUserId}/show:
    get:
      tags:
        - projectMember
      summary: 显示成员信息
      description: 显示成员信息
      operationId: projectProjectIdMemberMemberUserIdShowGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/MemberUserId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/all:
    get:
      tags:
        - projectTask
      summary: 所有任务
      description: 列出所有任务
      operationId: projectProjectIdTaskAllGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
        - $ref: '#/components/parameters/Offset'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  totalCount:
                    type: integer
                    description: 任务总数量
                  taskList:
                    type: array
                    items:
                      $ref: '#/components/schemas/TaskInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/my:
    get:
      tags:
        - projectTask
      summary: 指派给我的任务
      description: 列出指派给我的任务
      operationId: projectProjectIdTaskMyGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
        - name: state
          in: query
          required: true
          schema:
            type: string
            default: all
            description: 任务状态
            enum:
              - all
              - closed
              - unclose
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/TaskInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/record/{taskId}/depend:
    get:
      tags:
        - projectTask
      summary: 列出依赖工单
      description: 列出依赖工单
      operationId: projectProjectIdTaskRecordTaskIdDependGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/TaskId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  myDependList:
                    type: array
                    items:
                      $ref: '#/components/schemas/IssueInfo'
                  dependMeList:
                    type: array
                    items:
                      $ref: '#/components/schemas/IssueInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/record/{taskId}/events:
    get:
      tags:
        - projectTask
      summary: 任务相关事件
      description: 列出任务相关事件
      operationId: projectProjectIdTaskRecordTaskIdEventsGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/TaskId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EventInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/record/{taskId}/shortNote:
    get:
      tags:
        - projectTask
      summary: 便签方式显示任务
      description: 便签方式显示任务
      operationId: projectProjectIdTaskRecordTaskIdShortNoteGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/TaskId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/record/{taskId}/show:
    get:
      tags:
        - projectTask
      summary: 显示任务
      description: 显示任务
      operationId: projectProjectIdTaskRecordTaskIdShowGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/TaskId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/task/record/{taskId}/subTask:
    get:
      tags:
        - projectTask
      summary: 列出子任务
      description: 列出子任务
      operationId: projectProjectIdTaskRecordTaskIdSubTaskGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/TaskId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SubTaskInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/lang:
    get:
      tags:
        - projectTestCase
      summary: 列出生成测试代码支持的语言
      description: 列出生成测试代码支持的语言
      operationId: projectProjectIdTestCaseLangGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/lang/{lang}:
    get:
      tags:
        - projectTestCase
      summary: 列出生成测试代码支持的框架
      description: 列出生成测试代码支持的框架
      operationId: projectProjectIdTestCaseLangLangGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/Lang'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/lang/{lang}/{framework}/{entryId}:
    get:
      tags:
        - projectTestCase
      summary: 生成测试用例代码
      description: 生成测试用例代码
      operationId: projectProjectIdTestCaseLangLangFrameworkEntryIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/Lang'
        - $ref: '#/components/parameters/Framework'
        - $ref: '#/components/parameters/EntryId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            text/plain:
              schema:
                type: string
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/list/{entryId}:
    get:
      tags:
        - projectTestCase
      summary: 列出测试用例
      description: 列出测试用例
      operationId: projectProjectIdTestCaseListEntryIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/EntryId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/EntryInfo'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/report/{entryId}:
    post:
      tags:
        - projectTestCase
      summary: 上报测试结果
      description: 上报测试结果
      operationId: projectProjectIdTestCaseReportEntryIdPost
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/EntryId'
        - $ref: '#/components/parameters/AccessToken'
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                resultType:
                  type: string
                  description: 测试结果
                  enum:
                    - success
                    - warn
                    - fail
                desc:
                  type: string
                  description: 测试结果描述
                imageList:
                  type: array
                  items:
                    type: string
                extraFileList:
                  type: array
                  items:
                    type: string
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                type: object
                properties:
                  resultId:
                    type: string
                    description: 结果ID
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /project/{projectId}/testCase/show/{entryId}:
    get:
      tags:
        - projectTestCase
      summary: 显示测试用例或目录
      description: 显示测试用例或目录
      operationId: projectProjectIdTestCaseShowEntryIdGet
      parameters:
        - $ref: '#/components/parameters/ProjectId'
        - $ref: '#/components/parameters/EntryId'
        - $ref: '#/components/parameters/AccessToken'
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
  /show:
    get:
      tags:
        - global
      summary: 显示软件桌面
      description: 显示软件桌面
      operationId: showGet
      responses:
        '200':
          description: 成功
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/EmptyRes'
        '500':
          description: 失败
          headers:
            Access-Control-Allow-Origin:
              schema:
                type: string
                default: '*'
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrInfo'
components:
  parameters:
    AccessToken:
      in: query
      name: accessToken
      schema:
        type: string
      required: true
      description: 访问令牌
    BugId:
      in: path
      name: bugId
      schema:
        type: string
      required: true
      description: 缺陷ID
    ChannelId:
      in: path
      name: channelId
      schema:
        type: string
      required: true
      description: 频道ID
    CommentId:
      in: path
      name: commentId
      schema:
        type: string
      required: true
      description: 代码评论ID
    CommentThreadId:
      in: path
      name: commentThreadId
      schema:
        type: string
      required: true
      description: 代码评论会话ID
    DocId:
      in: path
      name: docId
      schema:
        type: string
      required: true
      description: 文档ID
    DocSpaceId:
      in: path
      name: docSpaceId
      schema:
        type: string
      required: true
      description: 文档空间ID
    EntryId:
      in: path
      name: entryId
      schema:
        type: string
      required: true
      description: 测试用例节点Id
    Framework:
      in: path
      name: framework
      schema:
        type: string
      required: true
      description: 代码框架
    Lang:
      in: path
      name: lang
      schema:
        type: string
      required: true
      description: 编程语言
    Limit:
      in: query
      name: limit
      schema:
        type: integer
        minimum: 1
      required: true
      description: 列表大小
    MemberUserId:
      in: path
      name: memberUserId
      schema:
        type: string
      required: true
      description: 项目成员ID
    Offset:
      in: query
      name: offset
      schema:
        type: integer
        minimum: 0
      required: true
      description: 列表偏移
    ProjectId:
      in: path
      name: projectId
      schema:
        type: string
      required: true
      description: 项目ID
    TaskId:
      in: path
      name: taskId
      schema:
        type: string
      required: true
      description: 任务ID
  schemas:
    BugInfo:
      type: object
      properties:
        bugId:
          type: string
          description: 缺陷ID
        title:
          type: string
          description: 标题
        state:
          type: string
          description: 状态
          enum:
            - plan
            - process
            - check
            - close
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        execUserId:
          type: string
          description: 执行人ID
        execDisplayName:
          type: string
          description: 执行人名称
        checkUserId:
          type: string
          description: 检查人ID
        checkDisplayName:
          type: string
          description: 检查人名称
        execAwardPoint:
          type: integer
          minimum: 0
          description: 执行奖励
        checkAwardPoint:
          type: integer
          minimum: 0
          description: 检查奖励
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
        softwareVersion:
          type: string
          description: 软件版本
        level:
          type: string
          description: 缺陷级别
          enum:
            - minor
            - major
            - critical
            - blocker
        priority:
          type: string
          description: 优先级
          enum:
            - low
            - normal
            - high
            - urgent
            - immediate
    ChannelInfo:
      type: object
      properties:
        channelId:
          type: string
          description: 频道ID
        name:
          type: string
          description: 频道名称
        pubChannel:
          type: boolean
          description: 是否是公开频道
        systemChannel:
          type: boolean
          description: 是否是系统频道
        readonly:
          type: boolean
          description: 是否是只读状态
        closed:
          type: boolean
          description: 是否是关闭状态
        ownerUserId:
          type: string
          description: 创建者ID
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
    CodeCommentInfo:
      type: object
      properties:
        commentId:
          type: string
          description: 代码评论ID
        threadId:
          type: string
          description: 代码评论会话ID
        contentType:
          type: string
          description: 内容类型
          enum:
            - text
            - markdown
        content:
          type: string
          description: 内容
        userId:
          type: string
          description: 用户ID
        userDisplayName:
          type: string
          description: 用户名称
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
        canUpdate:
          type: boolean
          description: 是否可以更新
        canRemove:
          type: boolean
          description: 是否可以删除
    DocInfo:
      type: object
      properties:
        docId:
          type: string
          description: 文档标题
        docSpaceId:
          type: string
          description: 文档空间ID
        title:
          type: string
          description: 文档标题
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateUserId:
          type: string
          description: 更新人ID
        updateDisplayName:
          type: string
          description: 更新人名称
        updateTime:
          type: integer
          description: 更新时间
          format: int64
    DocSpaceInfo:
      type: object
      properties:
        docSpaceId:
          type: string
          description: 文档空间ID
        title:
          type: string
          description: 文档空间标题
    EmptyRes:
      type: object
    EntryInfo:
      type: object
      properties:
        entryId:
          type: string
          description: 测试用例节点ID
        entryType:
          type: string
          description: 测试用例节点类型
          enum:
            - dir
            - testcase
        title:
          type: string
          description: 节点标题
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateUserId:
          type: string
          description: 更新人ID
        updateDisplayName:
          type: string
          description: 更新人名称
        updateTime:
          type: integer
          description: 更新时间
          format: int64
    ErrInfo:
      type: object
      properties:
        errMsg:
          type: string
          description: 错误信息
    EventInfo:
      type: object
      properties:
        eventId:
          type: string
          description: 事件ID
        userId:
          type: string
          description: 事件相关用户ID
        userDisplayName:
          type: string
          description: 用户名称
        eventType:
          type: string
          description: 事件类型
          enum:
            - user
            - project
            - task
            - bug
            - sprit
            - doc
            - disk
            - app
            - bookShelf
            - robot
            - earthly
            - gitlab
            - github
            - gitea
            - gitee
            - gogs
            - jira
            - confluence
            - jenkins
        refType:
          type: string
          description: 事件关联类型
          enum:
            - none
            - user
            - project
            - channel
            - sprit
            - task
            - bug
            - doc
            - book
            - robot
            - repo
        refId:
          type: string
          description: 事件关联ID
        eventTime:
          type: integer
          description: 事件事件
          format: int64
        eventData:
          type: object
          description: 事件内容
    IssueInfo:
      type: object
      properties:
        issueId:
          type: string
          description: 工单ID
        issueType:
          type: string
          description: 工单类型
          enum:
            - task
            - bug
        title:
          type: string
          description: 标题
        state:
          type: string
          description: 状态
          enum:
            - plan
            - process
            - check
            - close
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        execUserId:
          type: string
          description: 执行人ID
        execDisplayName:
          type: string
          description: 执行人名称
        checkUserId:
          type: string
          description: 检查人ID
        checkDisplayName:
          type: string
          description: 检查人名称
        execAwardPoint:
          type: integer
          minimum: 0
          description: 执行奖励
        checkAwardPoint:
          type: integer
          minimum: 0
          description: 检查奖励
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
    MsgInfo:
      type: object
      properties:
        msgId:
          type: string
          description: 消息ID
        channelId:
          type: string
          description: 频道ID
        content:
          type: string
          description: 消息内容(ProseMirror格式)
        senderUserId:
          type: string
          description: 发送用户ID
        senderDisplayName:
          type: string
          description: 发送者名称
        senderType:
          type: string
          description: 发送者类型
          enum:
            - member
            - robot
        sendTime:
          type: integer
          description: 发送时间
          format: int64
        hasUpdateTime:
          type: boolean
          description: 是否有修改
        updateTime:
          type: integer
          description: 修改时间
          format: int64
    SimpleMemberInfo:
      type: object
      properties:
        memberUserId:
          type: string
          description: 项目成员ID
        displayName:
          type: string
          description: 项目成员名称
    SubTaskInfo:
      type: object
      properties:
        subTaskId:
          type: string
          description: 子任务ID
        taskId:
          type: string
          description: 任务ID
        title:
          type: string
          description: 标题
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        done:
          type: boolean
          description: 是否完成
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
    TaskInfo:
      type: object
      properties:
        taskId:
          type: string
          description: 任务ID
        title:
          type: string
          description: 标题
        state:
          type: string
          description: 状态
          enum:
            - plan
            - process
            - check
            - close
        createUserId:
          type: string
          description: 创建人ID
        createDisplayName:
          type: string
          description: 创建人名称
        execUserId:
          type: string
          description: 执行人ID
        execDisplayName:
          type: string
          description: 执行人名称
        checkUserId:
          type: string
          description: 检查人ID
        checkDisplayName:
          type: string
          description: 检查人名称
        execAwardPoint:
          type: integer
          minimum: 0
          description: 执行奖励
        checkAwardPoint:
          type: integer
          minimum: 0
          description: 检查奖励
        createTime:
          type: integer
          description: 创建时间
          format: int64
        updateTime:
          type: integer
          description: 更新时间
          format: int64
        priority:
          type: string
          description: 优先级
          enum:
            - low
            - middle
            - high
`;