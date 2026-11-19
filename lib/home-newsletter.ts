export const homeNewsletter = `
<section id="newsletter" class="home-newsletter" aria-labelledby="newsletter-title">
  <div class="container home-newsletter__inner">
    <div class="home-newsletter__copy">
      <h2 id="newsletter-title">요즘 IT 업계의 새로운 소식을<br> 뉴스레터로 받아보세요</h2>
      <p>새롭게 등장한 기술과 서비스, 업계의 흥미로운 움직임까지.<br> 지금 IT에서 일어나는 일을 뉴스레터로 전해드려요.</p>
    </div>
    <div class="home-newsletter__controls" role="group" aria-label="뉴스레터 구독">
      <div class="home-newsletter__field">
        <input type="email" aria-label="뉴스레터를 받을 이메일 주소" aria-describedby="newsletter-hint"
          autocomplete="email" placeholder="이메일을 입력해 주세요">
        <p id="newsletter-hint" class="home-newsletter__hint">
          <img src="/newsletter/info.svg" alt="" width="16" height="16">
          이메일 형식에 맞게 입력해 주세요.
        </p>
      </div>
      <button type="button" disabled>입력 완료</button>
    </div>
  </div>
</section>`;
