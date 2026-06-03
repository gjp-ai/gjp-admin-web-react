import i18n from '../../../../shared-lib/src/i18n/i18n';

const enTranslations = {
  sentence: {
    title: 'Sentence',
    subtitle: 'Manage education sentences, translations, explanations, and audio',
    pageTitle: 'Sentence Management',
    create: 'Create Sentence',
    edit: 'Edit Sentence',
    delete: 'Delete Sentence',
    view: 'View Sentence',
    noRecordsFound: 'No sentences found',
    fields: {
      name: 'Sentence Text',
      phonetic: 'Phonetic',
      phoneticAudio: 'Phonetic Audio',
      phoneticAudioFilename: 'Audio Filename',
      uploadMethod: 'Audio Upload Method',
      byFilename: 'By Filename',
      uploadFile: 'Upload File',
      chooseAudioFile: 'Choose Audio File',
      selectedFile: 'Selected file',
      translation: 'Translation',
      explanation: 'Explanation',
      difficultyLevel: 'Difficulty Level',
      term: 'Term',
      week: 'Week',
      channel: 'Channel',
      tags: 'Tags',
      language: 'Language',
      displayOrder: 'Order',
      status: 'Status',
      isActive: 'Active',
      updatedAt: 'Updated At',
    },
    placeholders: {
      searchName: 'Search by sentence text',
      searchTags: 'Search by tags',
    },
    actions: {
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
    },
    messages: {
      deleteConfirm: 'Are you sure you want to delete the sentence',
    },
  },
};

const zhTranslations = {
  sentence: {
    title: '句子管理',
    subtitle: '管理教育句子、翻译、释义和音频',
    pageTitle: '句子管理',
    create: '创建句子',
    edit: '编辑句子',
    delete: '删除句子',
    view: '查看句子',
    noRecordsFound: '未找到句子',
    fields: {
      name: '句子内容',
      phonetic: '音标',
      phoneticAudio: '发音音频',
      phoneticAudioFilename: '音频文件名',
      uploadMethod: '音频上传方式',
      byFilename: '按文件名指定',
      uploadFile: '上传文件',
      chooseAudioFile: '选择音频文件',
      selectedFile: '已选择文件',
      translation: '翻译',
      explanation: '解释/上下文',
      difficultyLevel: '难度',
      term: '学期',
      week: '周',
      channel: '频道',
      tags: '标签',
      language: '语言',
      displayOrder: '排序',
      status: '状态',
      isActive: '激活',
      updatedAt: '更新时间',
    },
    placeholders: {
      searchName: '按句子内容搜索',
      searchTags: '按标签搜索',
    },
    actions: {
      view: '查看',
      edit: '编辑',
      delete: '删除',
    },
    messages: {
      deleteConfirm: '您确定要删除该句子',
    },
  },
};

i18n.addResourceBundle('en', 'translation', enTranslations, true, true);
i18n.addResourceBundle('zh', 'translation', zhTranslations, true, true);

export default i18n;
