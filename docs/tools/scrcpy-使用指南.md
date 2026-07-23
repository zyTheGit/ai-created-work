# scrcpy 完全使用指南

> scrcpy（**scr**een **c**o**py**）是一款开源 Android 投屏控制工具，通过 USB 或 TCP/IP 连接，无需 root 权限，无需在手机上安装应用。支持 Linux、Windows、macOS。
>
> 官方仓库：<https://github.com/Genymobile/scrcpy>

---

## 目录

1. [功能概述](#功能概述)
2. [安装](#安装)
3. [前提条件](#前提条件)
4. [连接方式](#连接方式)
5. [基础用法](#基础用法)
6. [视频配置](#视频配置)
7. [音频配置](#音频配置)
8. [键盘与鼠标](#键盘与鼠标)
9. [窗口管理](#窗口管理)
10. [录屏](#录屏)
11. [设备控制](#设备控制)
12. [快捷键大全](#快捷键大全)
13. [高级用法](#高级用法)
14. [常见问题与排障](#常见问题与排障)

---

## 功能概述

- **轻量**：原生界面，仅显示设备屏幕
- **高性能**：30~120fps（取决于设备）
- **高质量**：支持 1920×1080 及以上分辨率
- **低延迟**：35~70ms
- **快速启动**：约 1 秒显示第一帧
- **无侵入**：无需在 Android 设备上安装任何应用
- **无广告**：无需账户，免费开源

### 支持的特性

- 音频转发（Android 11+）
- 录屏
- 虚拟显示器
- 熄屏投屏
- 双向剪贴板
- 可配置视频质量
- 摄像头投屏（Android 12+）
- V4L2 虚拟摄像头（Linux）
- 物理键盘/鼠标模拟（HID）
- 游戏手柄支持
- OTG 模式

---

## 安装

### Windows

1. 从 [GitHub Releases](https://github.com/Genymobile/scrcpy/releases) 下载最新的 `scrcpy-*-win64.zip`
2. 解压到任意目录
3. 运行 `scrcpy.exe`

> 或通过 winget 安装：`winget install scrcpy`

### macOS

```bash
brew install scrcpy
```

### Linux

```bash
# Debian/Ubuntu
sudo apt install scrcpy

# Fedora
sudo dnf install scrcpy

# Arch Linux
sudo pacman -S scrcpy
```

---

## 前提条件

### 设备要求

- Android 设备需 API >= 21（Android 5.0+）
- 音频转发需 API >= 30（Android 11+）
- 虚拟显示器需 Android 10+

### 开启 USB 调试

1. 打开手机 **设置 → 关于手机**，连续点击"版本号"7 次，开启开发者模式
2. 进入 **设置 → 系统 → 开发者选项**，开启 **USB 调试**

### 小米等设备特殊配置

部分设备（尤其是小米）可能遇到以下错误：

```
Injecting input events requires the caller (or the source of the instrumentation,
if any) to have the INJECT_EVENTS permission.
```

此时需要在开发者选项中额外开启 **"USB 调试（安全设置）"**（注意：这是和"USB 调试"不同的选项），设置后需要重启手机。

---

## 连接方式

### USB 有线连接

最基本的方式，用 USB 线连接手机和电脑：

```bash
# 确认设备已识别
adb devices

# 启动 scrcpy
scrcpy
```

### 无线连接（TCP/IP）

#### 方式一：自动配置（推荐）

```bash
# USB 连接手机后，直接执行（自动开启无线并连接）
scrcpy --tcpip
```

#### 方式二：手动配置

```bash
# 1. USB 连接手机
adb devices

# 2. 启动无线 ADB 端口
adb tcpip 5555

# 3. 拔掉 USB 线，用手机 IP 连接
adb connect 192.168.x.x:5555

# 4. 启动 scrcpy
scrcpy
# 或用 --tcpip 直接指定 IP
scrcpy --tcpip=192.168.x.x
```

#### 方式三：Android 11+ 无线调试（无需 USB 线）

```
设置 → 开发者选项 → 无线调试 → 启用
→ 点击"使用配对码配对"
```

```bash
# 配对（只需一次）
adb pair 192.168.x.x:XXXXX

# 连接
adb connect 192.168.x.x:5555

# 启动
scrcpy
```

### 多设备选择

当连接多台设备时，需指定目标设备：

```bash
# 通过序列号指定
scrcpy -s 0123456789abcdef

# 选择唯一 USB 设备
scrcpy -d

# 选择唯一 TCP/IP 设备
scrcpy -e

# 通过环境变量指定
export ANDROID_SERIAL=0123456789abcdef
scrcpy
```

---

## 基础用法

```bash
# 基本投屏
scrcpy

# 全屏模式
scrcpy -f

# 限制分辨率（提高性能）
scrcpy -m 1024

# 限制帧率
scrcpy --max-fps=60

# 不传音频
scrcpy --no-audio

# 熄屏投屏
scrcpy -S

# 熄屏 + 保持唤醒
scrcpy -Sw

# 只读模式（不控制设备）
scrcpy -n
```

---

## 视频配置

### 分辨率

```bash
# 限制最大宽度（高度按比例缩放）
scrcpy -m 1024

# 设置最小对齐值（用于编码器对齐）
scrcpy --min-size-alignment=8
```

### 码率

```bash
# 设置视频码率（默认 8Mbps）
scrcpy -b 4M    # 4Mbps，无线连接推荐
scrcpy -b 16M   # 16Mbps，画质更好
scrcpy -b 2M    # 2Mbps，低带宽场景
```

### 帧率

```bash
# 限制最大帧率
scrcpy --max-fps=30
scrcpy --max-fps=15  # 极低帧率，节省资源

# 显示实际帧率
scrcpy --print-fps

# 投屏中动态查看 FPS：按 MOD+i
```

### 编码器

```bash
# 选择编码格式（h264 默认，h265 画质更好，av1 需要设备支持）
scrcpy --video-codec=h265

# 查看可用编码器
scrcpy --list-encoders

# 指定编码器
scrcpy --video-codec=h264 --video-encoder=OMX.qcom.video.encoder.avc
```

### 画面方向

```bash
# 捕获方向（影响录制）
scrcpy --capture-orientation=90

# 锁定捕获方向（旋转设备不改变画面）
scrcpy --capture-orientation=@

# 显示方向（仅客户端旋转）
scrcpy --orientation=90
```

### 画面裁剪

```bash
# 只捕获部分屏幕
scrcpy --crop=1224:1440:0:0   # 宽:高:x偏移:y偏移
```

### 视频缓冲

```bash
# 增加视频缓冲（减少卡顿，增加延迟）
scrcpy --video-buffer=50  # 50ms 缓冲
```

### 多显示器

```bash
# 列出可用显示器
scrcpy --list-displays

# 选择要投屏的显示器
scrcpy --display-id=1

# 创建虚拟显示器（Android 10+）
scrcpy --new-display=1920x1080
```

---

## 音频配置

> 需要 Android 11+

```bash
# 禁用音频
scrcpy --no-audio

# 仅转发音频（不显示画面）
scrcpy --no-video

# 设置音频缓冲
scrcpy --audio-buffer=200  # 200ms 缓冲，减少卡顿

# 不播放音频（只录制）
scrcpy --no-audio-playback --record=file.mp4
```

---

## 键盘与鼠标

### 键盘模式

scrcpy 提供三种键盘模式：

```bash
# SDK 模式（默认）：通过 Android API 注入按键，仅支持 ASCII
scrcpy --keyboard=sdk

# UHID 模式（推荐）：模拟物理 HID 键盘，支持所有字符
scrcpy --keyboard=uhid
scrcpy -K   # 简写

# AOA 模式：通过 USB 模拟键盘，仅支持 USB 连接
scrcpy --keyboard=aoa

# 禁用键盘
scrcpy --keyboard=disabled
```

**UHID 模式配置键盘布局**（只需一次）：

按 `MOD+k` 或在手机上打开 **设置 → 系统 → 语言和输入法 → 实体键盘**，配置键盘布局与电脑一致。在此页面还可以禁用屏幕键盘。

### 鼠标模式

```bash
# SDK 模式（默认）
scrcpy --mouse=sdk

# UHID 模拟物理鼠标
scrcpy --mouse=uhid
scrcpy -M   # 简写

# 禁用鼠标
scrcpy --mouse=disabled
```

### 剪贴板同步

```bash
# 自动同步剪贴板（默认开启）
scrcpy --no-clipboard-autosync   # 禁用自动同步

# 兼容模式粘贴（某些设备需要）
scrcpy --legacy-paste
```

### 拖放文件

```bash
# 拖放 .apk 文件到窗口 → 安装 APK
# 拖放其他文件到窗口 → 推送到 /sdcard/Download/

# 更改推送目标目录
scrcpy --push-target=/sdcard/Movies/
```

---

## 窗口管理

```bash
# 全屏启动
scrcpy -f

# 设置窗口标题
scrcpy --window-title="我的手机"

# 设置窗口位置和大小
scrcpy --window-x=100 --window-y=100 --window-width=800 --window-height=600

# 无边框窗口
scrcpy --window-borderless

# 窗口置顶
scrcpy --always-on-top

# 解锁宽高比
scrcpy --no-window-aspect-ratio-lock

# 设置全屏背景色（16进制色值）
scrcpy --fullscreen --background-color=#234567

# 禁用屏幕保护
scrcpy --disable-screensaver

# 渲染适配模式
scrcpy --render-fit=letterbox   # 默认，保持比例留黑边
scrcpy --render-fit=unscaled    # 不缩放（虚拟显示器默认）
scrcpy --render-fit=stretched   # 拉伸填充窗口
```

---

## 录屏

```bash
# 投屏的同时录制到文件
scrcpy --record=record.mp4

# 只录屏，不显示窗口
scrcpy --no-playback --record=record.mkv

# 仅录制音频
scrcpy --no-video --record=record.mp4

# 使用 MKV 格式（录制中断时文件不会损坏）
scrcpy --record=record.mkv
```

录制的默认编码与显示编码相同。录制方向可独立设置：

```bash
scrcpy --record-orientation=90
```

---

## 设备控制

### 电源管理

```bash
# 保持唤醒（插电时）
scrcpy -w

# 保持活跃（模拟用户活动，防止锁屏）
scrcpy --keep-active

# 启动时熄屏
scrcpy -S

# 关闭时熄屏
scrcpy --power-off-on-close

# 设置屏幕超时（秒）
scrcpy --screen-off-timeout=300  # 5分钟
```

### 显示触摸

```bash
# 在手机上显示触摸点（演示时有用）
scrcpy -t
```

### 启动应用

```bash
# 列出已安装应用
scrcpy --list-apps

# 启动指定应用（通过包名）
scrcpy --start-app=org.mozilla.firefox

# 启动前强制停止（+ 前缀）
scrcpy --start-app=+org.mozilla.firefox

# 通过应用名搜索（? 前缀）
scrcpy --start-app=?firefox
```

---

## 快捷键大全

> `MOD` 默认为 <kbd>Alt</kbd>（Windows/Linux）或 <kbd>Cmd</kbd>（macOS）
>
> 可通过 `--shortcut-mod` 自定义：`scrcpy --shortcut-mod=lctrl,rctrl`

| 操作 | 快捷键 |
|------|--------|
| **退出** | <kbd>MOD</kbd>+<kbd>q</kbd> |
| **切换全屏** | <kbd>MOD</kbd>+<kbd>f</kbd> 或 <kbd>F11</kbd> |
| **旋转显示（左）** | <kbd>MOD</kbd>+<kbd>←</kbd> |
| **旋转显示（右）** | <kbd>MOD</kbd>+<kbd>→</kbd> |
| **水平翻转** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>←</kbd>/<kbd>→</kbd> |
| **垂直翻转** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>↑</kbd>/<kbd>↓</kbd> |
| **暂停显示** | <kbd>MOD</kbd>+<kbd>z</kbd> |
| **取消暂停** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>z</kbd> |
| **重置编码器** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>r</kbd> |
| **1:1 像素模式** | <kbd>MOD</kbd>+<kbd>g</kbd> |
| **去除黑边** | <kbd>MOD</kbd>+<kbd>w</kbd> / 双击黑边 |
| | |
| **HOME** | <kbd>MOD</kbd>+<kbd>h</kbd> / 鼠标中键 |
| **BACK（返回）** | <kbd>MOD</kbd>+<kbd>b</kbd> / <kbd>MOD</kbd>+<kbd>Backspace</kbd> / 鼠标右键 |
| **最近任务** | <kbd>MOD</kbd>+<kbd>s</kbd> / 鼠标第4键 |
| **MENU（菜单）** | <kbd>MOD</kbd>+<kbd>m</kbd> |
| **音量 +** | <kbd>MOD</kbd>+<kbd>↑</kbd> |
| **音量 -** | <kbd>MOD</kbd>+<kbd>↓</kbd> |
| **电源键** | <kbd>MOD</kbd>+<kbd>p</kbd> |
| **点亮屏幕** | 鼠标右键（屏幕关闭时） |
| **熄屏（保持投屏）** | <kbd>MOD</kbd>+<kbd>o</kbd> |
| **点亮屏幕（投屏中）** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>o</kbd> |
| **旋转屏幕** | <kbd>MOD</kbd>+<kbd>r</kbd> |
| | |
| **下拉通知栏** | <kbd>MOD</kbd>+<kbd>n</kbd> |
| **展开设置面板** | 两次 <kbd>MOD</kbd>+<kbd>n</kbd> |
| **收起通知面板** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>n</kbd> |
| | |
| **复制到剪贴板** | <kbd>MOD</kbd>+<kbd>c</kbd> |
| **剪切到剪贴板** | <kbd>MOD</kbd>+<kbd>x</kbd> |
| **同步剪贴板并粘贴** | <kbd>MOD</kbd>+<kbd>v</kbd> |
| **注入电脑剪贴板文本** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>v</kbd> |
| | |
| **开启键盘设置**（UHID） | <kbd>MOD</kbd>+<kbd>k</kbd> |
| **显示 FPS 计数** | <kbd>MOD</kbd>+<kbd>i</kbd> |
| **双指缩放** | <kbd>Ctrl</kbd>+点击并拖拽 |
| **双指滑动（垂直）** | <kbd>Shift</kbd>+点击并拖拽 |
| **双指滑动（水平）** | <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+点击并拖拽 |
| | |
| **摄像头闪光灯** | <kbd>MOD</kbd>+<kbd>t</kbd> |
| **关闭摄像头闪光灯** | <kbd>MOD</kbd>+<kbd>Shift</kbd>+<kbd>t</kbd> |
| **摄像头变焦+** | <kbd>MOD</kbd>+<kbd>↑</kbd>（摄像头模式下） |
| **摄像头变焦-** | <kbd>MOD</kbd>+<kbd>↓</kbd>（摄像头模式下） |

---

## 高级用法

### 虚拟显示器

创建一个与物理显示器独立的虚拟屏幕：

```bash
# 创建 1920x1080 的虚拟显示器并启动应用
scrcpy --new-display=1920x1080 --start-app=org.videolan.vlc

# 弹性显示器（随窗口自动调整大小）
scrcpy --new-display -x
```

### 摄像头投屏

```bash
# 使用后置摄像头
scrcpy --video-source=camera --camera-size=1920x1080 --camera-facing=back

# 使用前置摄像头
scrcpy --video-source=camera --camera-facing=front

# 录摄像头到文件
scrcpy --video-source=camera --video-codec=h265 --record=file.mp4
```

### V4L2 虚拟摄像头（Linux）

将 Android 设备画面作为电脑摄像头使用：

```bash
scrcpy --v4l2-sink=/dev/video2 --no-playback
```

### OTG 模式（无需 USB 调试）

通过 OTG 线连接，只做键盘鼠标控制（不投屏）：

```bash
scrcpy --otg
```

### 游戏手柄支持

```bash
# 将电脑上的游戏手柄映射到 Android 设备
scrcpy -G   # 简写
scrcpy --gamepad=uhid
```

### 录制摄像头到 webcam

```bash
scrcpy --video-source=camera --camera-size=1920x1080 --camera-facing=front --v4l2-sink=/dev/video2 --no-playback
```

### 仅控制不投屏

```bash
# 不投屏不传音频，仅用 UHID 键盘鼠标控制
scrcpy --no-video --no-audio --mouse=uhid --keyboard=uhid
scrcpy --no-video --no-audio -MK  # 简写
```

---

## 常见问题与排障

### 1. `adb devices` 看不到设备

- 确认 USB 连接线可用（有些线只能充电不能传输数据）
- 在开发者选项中重新关闭再开启 USB 调试
- 更换 USB 端口
- Windows 需安装手机 USB 驱动

### 2. 无线连接失败：`cannot connect to x.x.x.x:5555: 由于目标计算机积极拒绝，无法连接`

- **必须先 USB 连接执行 `adb tcpip 5555`** 开启无线端口，手机重启后需重新执行
- 手机锁屏后 Wi-Fi 可能断开，可在开发者选项中开启"不锁定 Wi-Fi 网络"
- Android 11+ 推荐直接用"无线调试"配对（无需 TCPIP 步骤）
- 确认手机和电脑在同一 Wi-Fi 网络
- 确认手机 IP 地址没变（可用 `ping` 测试）

### 3. 画面卡顿 / 延迟高

```bash
# 降低分辨率
scrcpy -m 1024

# 限制帧率
scrcpy --max-fps=30

# 降低码率（特别对无线连接有效）
scrcpy -b 4M

# 有线 USB 延迟最低
```

### 4. 鼠标键盘控制无效

- 确认 USB 调试（安全设置）已开启并重启手机
- 尝试 `--keyboard=uhid` 模式
- 小米等设备需要额外开启"USB 调试（安全设置）"

### 5. 旋转屏幕不生效

某些应用会锁定屏幕方向（如视频播放器），建议用 `--orientation=90` 或 `--capture-orientation=90` 强制旋转。

### 6. 音画不同步

```bash
# 尝试增加音频缓冲
scrcpy --audio-buffer=200

# 使用较短时间缓冲音视频
scrcpy --video-buffer=50 --audio-buffer=100
```

### 7. 投屏全屏后四周有黑边

- 双击黑边可消除（等价于按 `MOD+w`）
- 或者用 `--render-fit=stretched` 拉伸填充

### 8. 如何查看当前版本

```bash
scrcpy --version
```

### 9. `adb` 命令找不到

- 确保 ADB 已安装并加入 PATH
- 可从 [Android Developer 官网](https://developer.android.com/studio/releases/platform-tools) 下载 Platform Tools

### 10. 编码器崩溃

```bash
# 列出可用编码器
scrcpy --list-encoders

# 尝试其他编码器
scrcpy --video-encoder=OMX.qcom.video.encoder.avc
```

---

## 参考链接

- [GitHub 仓库](https://github.com/Genymobile/scrcpy)
- [官方文档](https://github.com/Genymobile/scrcpy/tree/master/doc)
- [FAQ](https://github.com/Genymobile/scrcpy/blob/master/FAQ.md)

---

> 文档版本：基于 scrcpy v4.0
> 更新日期：2026-05-28
