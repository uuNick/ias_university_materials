import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        <div className="footer-column">
          <span className="column-title">Авторские права</span>
          <p className="footer-text">
            © {currentYear} Белорусско-Российский университет
          </p>
          <p className="footer-subtext">Все права защищены.</p>
        </div>

        <div className="footer-column">
          <span className="column-title">Разработчики системы</span>
          <p className="footer-text">IT-отдел БРУ</p>
        </div>

        <div className="footer-column">
          <span className="column-title">Поддержка</span>
          <a href="mailto:support@bru.by" className="footer-link">
            nikitasidarenko@gmail.com
          </a>
        </div>

        <div className="footer-column">
          <span className="column-title">Ресурсы</span>
          <a 
            href="http://e.biblio.bru.by/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="footer-link"
          >
            Электронная библиотека
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;