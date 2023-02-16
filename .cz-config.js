module.exports = {
  types: [
    {
      value: `feat`,
      name : 'feat:     新功能'
    },
    {
      value: `fix`,
      name : 'fix:      修复bug'
    },
    {
      value: `docs`,
      name : 'docs:     文档注释更改'
    },
    {
      value: `refactor`,
      name : 'refactor: 重构（不修复bug和新增功能）'
    },
    {
      value: `style`,
      name : 'style:    修改样式问题，不影响功能'
    },
    {
      value: `perf`,
      name : 'perf:     性能优化'
    },
    {
      value: `test`,
      name : 'test:     增加测试用例或修正测试用例'
    },
    {
      value: `revert`,
      name : 'revert:   回退版本'
    }
  ],
  skipQuestions: ['body', 'scopes', 'breaking', 'footer']
};