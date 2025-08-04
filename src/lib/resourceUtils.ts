/**
 * 资源路径转换工具
 * 处理Electron打包后的资源文件路径问题
 */

/**
 * 转换资源路径，使其在Electron环境中正确工作
 * @param path 原始资源路径，如 "/images/background.jpg"
 * @returns 转换后的路径
 */
export function resolveResourcePath(path: string): string {
    if (!path) return path;

    // 检查是否在Electron环境中
    const isElectron = window.electronAPI && typeof window.electronAPI === 'object';

    if (isElectron) {
        // 在Electron环境中，将绝对路径转换为相对路径
        // 因为public文件夹被复制到了应用根目录
        const relativePath = path.startsWith('/') ? path.substring(1) : path;
        return `./${relativePath}`;
    }

    // 在Web环境中，保持原路径不变
    return path;
}

/**
 * 批量转换资源路径
 * @param paths 路径数组
 * @returns 转换后的路径数组
 */
export function resolveResourcePaths(paths: string[]): string[] {
    return paths.map(resolveResourcePath);
}

/**
 * 检查是否为资源文件路径
 * @param path 路径字符串
 * @returns 是否为资源文件路径
 */
export function isResourcePath(path: string): boolean {
    if (!path) return false;

    const resourceExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.mp3', '.wav', '.ogg'];
    const lowerPath = path.toLowerCase();

    return resourceExtensions.some(ext => lowerPath.endsWith(ext));
}