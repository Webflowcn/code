/**
 * FadeContent 自定义元素
 * 属性说明：
 * @attr {boolean} blur - 是否启用模糊效果 (true/false)
 * @attr {number} duration - 动画持续时间 (500-3000ms)
 * @attr {string} easing - 动画缓动函数 (默认: ease-out, ease-in-out, 支持其他浏览器标准缓动函数)
 * @attr {number} delay - 动画延迟时间 (0-2000ms)
 * @attr {number} threshold - 元素可见比例触发阈值 (0.1-1.0)
 * @attr {number} initialOpacity - 初始透明度 (0.0-1.0)
 */
class FadeContentElement extends HTMLElement {
  // 构造函数：创建组件时最先被调用的方法
  constructor() {
    // 必须调用 super()，否则自定义元素将无法正常工作
    super();
    // 创建一个观察器变量，用于检测元素是否出现在视口中
    this.observer = null;
  }

  connectedCallback() {
    const blur = this.getAttribute('blur') === 'true';
    const duration = parseInt(this.getAttribute('duration')) || 1000;
    const easing = this.getAttribute('easing') || 'ease-out';
    const delay = parseInt(this.getAttribute('delay')) || 0;
    const threshold = parseFloat(this.getAttribute('threshold')) || 0.1;
    const initialOpacity = parseFloat(this.getAttribute('initialOpacity')) || 0;
    
    // 设置初始样式
    this.style.opacity = initialOpacity;
    this.style.transition = `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`;
    if (blur) {
      this.style.filter = 'blur(10px)';
    }

    // 创建观察器
    this.observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.observer.unobserve(this);
          setTimeout(() => {
            this.style.opacity = 1;
            if (blur) {
              this.style.filter = 'blur(0px)';
            }
          }, delay);
        }
      },
      { threshold }
    );

    this.observer.observe(this);
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// 注册自定义元素
customElements.define('fade-content', FadeContentElement);