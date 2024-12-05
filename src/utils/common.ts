export function useDebounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
  
    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        func(...args);
      }, wait);
    };
  }

  export function useThrottle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let lastCall = 0;
  
    return (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastCall >= limit) {
        lastCall = now;
        func(...args);
      }
    };
  }
  

  // 动态引入图片
export const getAssetsFile = (fileName: string) => {
  const path = `/src/assets/${fileName}`;
  const modules: Record<string, any> = import.meta.glob("@/assets/**/*.{png,svg,jpg,jpeg}", { eager: true });
  if (modules[path]) return modules[path].default;
  else {
    // 地址错误
    console.error("Error url is wrong path");
  }
};

