import React, { useState } from 'react';
import type { NodeViewComponentProps } from '@remirror/react';
import { useCommands } from '@remirror/react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { Select } from 'antd';
import EditorWrap from '../components/EditorWrap';
import style from './common.module.less';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const LANG_LIST = [
  'abap',
  'abnf',
  'actionscript',
  'ada',
  'agda',
  'al',
  'antlr4',
  'apacheconf',
  'apex',
  'apl',
  'applescript',
  'aql',
  'arduino',
  'arff',
  'armasm',
  'arturo',
  'asciidoc',
  'asm6502',
  'asmatmel',
  'aspnet',
  'autohotkey',
  'autoit',
  'avisynth',
  'avro-idl',
  'awk',
  'bash',
  'basic',
  'batch',
  'bbcode',
  'bicep',
  'birb',
  'bison',
  'bnf',
  'brainfuck',
  'brightscript',
  'bro',
  'bsl',
  'c',
  'cfscript',
  'chaiscript',
  'cil',
  'clike',
  'clojure',
  'cmake',
  'cobol',
  'coffeescript',
  'concurnas',
  'cooklang',
  'coq',
  'cpp',
  'crystal',
  'csharp',
  'cshtml',
  'csp',
  'css-extras',
  'css',
  'csv',
  'cue',
  'cypher',
  'd',
  'dart',
  'dataweave',
  'dax',
  'dhall',
  'diff',
  'django',
  'dns-zone-file',
  'docker',
  'dot',
  'ebnf',
  'editorconfig',
  'eiffel',
  'ejs',
  'elixir',
  'elm',
  'erb',
  'erlang',
  'etlua',
  'excel-formula',
  'factor',
  'false',
  'firestore-security-rules',
  'flow',
  'fortran',
  'fsharp',
  'ftl',
  'gap',
  'gcode',
  'gdscript',
  'gedcom',
  'gettext',
  'gherkin',
  'git',
  'glsl',
  'gml',
  'gn',
  'go-module',
  'go',
  'graphql',
  'groovy',
  'haml',
  'handlebars',
  'haskell',
  'haxe',
  'hcl',
  'hlsl',
  'hoon',
  'hpkp',
  'hsts',
  'http',
  'ichigojam',
  'icon',
  'icu-message-format',
  'idris',
  'iecst',
  'ignore',
  'inform7',
  'ini',
  'io',
  'j',
  'java',
  'javadoc',
  'javadoclike',
  'javascript',
  'javastacktrace',
  'jexl',
  'jolie',
  'jq',
  'js-extras',
  'js-templates',
  'jsdoc',
  'json',
  'json5',
  'jsonp',
  'jsstacktrace',
  'jsx',
  'julia',
  'keepalived',
  'keyman',
  'kotlin',
  'kumir',
  'kusto',
  'latex',
  'latte',
  'less',
  'lilypond',
  'linker-script',
  'liquid',
  'lisp',
  'livescript',
  'llvm',
  'log',
  'lolcode',
  'lua',
  'magma',
  'makefile',
  'markdown',
  'markup-templating',
  'markup',
  'mata',
  'matlab',
  'maxscript',
  'mel',
  'mermaid',
  'mizar',
  'mongodb',
  'monkey',
  'moonscript',
  'n1ql',
  'n4js',
  'nand2tetris-hdl',
  'naniscript',
  'nasm',
  'neon',
  'nevod',
  'nginx',
  'nim',
  'nix',
  'nsis',
  'objectivec',
  'ocaml',
  'odin',
  'opencl',
  'openqasm',
  'oz',
  'parigp',
  'parser',
  'pascal',
  'pascaligo',
  'pcaxis',
  'peoplecode',
  'perl',
  'php-extras',
  'php',
  'phpdoc',
  'plant-uml',
  'plsql',
  'powerquery',
  'powershell',
  'processing',
  'prolog',
  'promql',
  'properties',
  'protobuf',
  'psl',
  'pug',
  'puppet',
  'pure',
  'purebasic',
  'purescript',
  'python',
  'q',
  'qml',
  'qore',
  'qsharp',
  'r',
  'racket',
  'reason',
  'regex',
  'rego',
  'renpy',
  'rescript',
  'rest',
  'rip',
  'roboconf',
  'robotframework',
  'ruby',
  'rust',
  'sas',
  'sass',
  'scala',
  'scheme',
  'scss',
  'shell-session',
  'smali',
  'smalltalk',
  'smarty',
  'sml',
  'solidity',
  'solution-file',
  'soy',
  'sparql',
  'splunk-spl',
  'sqf',
  'sql',
  'squirrel',
  'stan',
  'stata',
  'stylus',
  'supercollider',
  'swift',
  'systemd',
  't4-cs',
  't4-templating',
  't4-vb',
  'tap',
  'tcl',
  'textile',
  'toml',
  'tremor',
  'tsx',
  'tt2',
  'turtle',
  'twig',
  'typescript',
  'typoscript',
  'unrealscript',
  'uorazor',
  'uri',
  'v',
  'vala',
  'vbnet',
  'velocity',
  'verilog',
  'vhdl',
  'vim',
  'visual-basic',
  'warpscript',
  'wasm',
  'web-idl',
  'wiki',
  'wolfram',
  'wren',
  'xeora',
  'xml-doc',
  'xojo',
  'xquery',
  'yaml',
  'yang',
  'zig',
];

export type EditCodeProps = NodeViewComponentProps & {
  lang: string;
  code: string;
};

export const EditCode: React.FC<EditCodeProps> = (props) => {
  const [lang, setLang] = useState(props.lang);
  const { deleteCode } = useCommands();
  const removeNode = () => {
    deleteCode((props.getPosition as () => number)());
  };

  return (
    <ErrorBoundary>
      <EditorWrap onChange={() => removeNode()}>
        <div className={style.selectHd}>
          <Select
            defaultValue={lang}
            showSearch
            onChange={(value) => {
              console.log(value);
              setLang(value);
            }}
          >
            {LANG_LIST.map((item) => (
              <Select.Option key={item} value={item}>
                {item}
              </Select.Option>
            ))}
          </Select>
        </div>

        <CodeEditor
          defaultValue={props.code}
          language={lang}
          minHeight={200}
          placeholder="请输入代码"
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            props.updateAttributes({
              lang: lang,
              code: e.target.value,
            });
          }}
          style={{
            fontSize: 14,
            backgroundColor: '#f5f5f5',
          }}
        />
      </EditorWrap>
    </ErrorBoundary>
  );
};

export type ViewCodeProps = NodeViewComponentProps & {
  lang: string;
  code: string;
  collapse?: boolean;
};

export const ViewCode: React.FC<ViewCodeProps> = (props) => {
  return (
    <ErrorBoundary>
      <EditorWrap collapse={props.collapse}>
        <CodeEditor
          value={props.code}
          language={props.lang}
          disabled
          style={{
            fontSize: 14,
            backgroundColor: '#f5f5f5',
          }}
        />
      </EditorWrap>
    </ErrorBoundary>
  );
};
