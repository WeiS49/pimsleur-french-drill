# Pimsleur 法语训练器

基于 Pimsleur 方法的音频优先法语训练 Web 应用。使用 ElevenLabs TTS + IndexedDB 缓存，低成本高质量音频生成。

## 功能

- **训练模式**: 中/英文提示 -> 主动回忆阶段（"请尝试用法语说..."）-> 倒计时压力条 -> 法语答案 -> 自动推进
- **三语 TTS**: 法语、中文、英文音频，均通过 ElevenLabs API 生成
- **音频缓存**: IndexedDB 缓存，每个句子只需调用一次 API
- **JSON 导入/导出**: 简单 JSON 格式管理句子数据
- **暗色主题**: 战术极简设计，大按钮适合走路时操作
- **PWA 支持**: Service Worker 离线静态资源

## 技术栈

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- ElevenLabs API (Flash v2.5)
- IndexedDB（音频缓存）+ localStorage（设置/进度）

## 快速开始

```bash
npm install
npm run dev
```

1. 进入 **Settings** 输入你的 ElevenLabs API Key
2. 点击 **Load Voices** 选择法语、中文、英文的语音
3. 进入 **Sentences** 导入 JSON 数据：

```json
[
  { "id": 1, "fr": "Bonjour", "cn": "你好", "en": "Hello" },
  { "id": 2, "fr": "J'habite à Puteaux", "cn": "我住在Puteaux", "en": "I live in Puteaux" }
]
```

4. 进入 **Drill** 点击 START 开始训练

## API 成本

由于音频缓存，成本为一次性支出：

| 句子数量 | 大约成本 |
|---------|---------|
| 300 句 | 免费 (Free tier) |
| 1,000 句 | ~$5 (Starter 计划，用 1 个月) |
| 2,000 句 | ~$22 (Creator 计划，用 1 个月) |

## 后续迭代

- [ ] 间隔重复调度器（Pimsleur 渐进间隔回忆算法）
- [ ] 30 分钟结构化课程 Session
- [ ] Capacitor iOS 包装，支持后台音频播放
- [ ] 发音提示（IPA 音标显示）
- [ ] 学习统计仪表盘

## 许可证

MIT
