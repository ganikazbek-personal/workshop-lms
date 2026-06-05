"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";

type Term = {
  term: string;
  category: string;
  definition: string;
};

const TERMS: Term[] = [
  // Вайб-кодинг
  { term: "Вайб-кодинг", category: "Основы", definition: "Подход к разработке где вы описываете задачу словами, а ИИ пишет код. Вы управляете идеей и результатом — не синтаксисом." },
  { term: "Промпт", category: "Основы", definition: "Текстовое задание для ИИ. Чем точнее и структурированнее промпт — тем лучше результат. Качество промпта напрямую определяет качество кода." },
  { term: "MVP", category: "Основы", definition: "Minimum Viable Product — минимальная рабочая версия продукта. Цель: запустить быстро, проверить идею, потом улучшать." },
  { term: "Итерация", category: "Основы", definition: "Один цикл улучшения продукта: сделал → проверил → улучшил. В вайб-кодинге итерации происходят за секунды." },
  { term: "Деплой", category: "Основы", definition: "Публикация сайта в интернет. После деплоя сайт доступен по реальной ссылке для любого пользователя." },
  { term: "Репозиторий", category: "Основы", definition: "Хранилище кода в облаке. Содержит всю историю изменений проекта. Обычно хранится на GitHub." },
  { term: "Стек", category: "Основы", definition: "Набор технологий для проекта. Например: HTML + CSS + JavaScript — это базовый фронтенд-стек." },

  // Инструменты
  { term: "VS Code", category: "Инструменты", definition: "Visual Studio Code — редактор кода от Microsoft. Главный рабочий инструмент воркшопа. Внутри работают все ИИ-ассистенты." },
  { term: "Claude Code", category: "Инструменты", definition: "ИИ-ассистент от Anthropic, встроенный в VS Code. Пишет код, создаёт файлы, исправляет ошибки по вашему описанию." },
  { term: "QWEN Code", category: "Инструменты", definition: "ИИ-ассистент от Alibaba, работает через OpenRouter. Бесплатная альтернатива Claude Code для экспериментов." },
  { term: "GitHub", category: "Инструменты", definition: "Облачное хранилище для кода. Vercel берёт код из GitHub и публикует сайт. Также сохраняет историю всех изменений." },
  { term: "Vercel", category: "Инструменты", definition: "Платформа для публикации сайтов. Подключается к GitHub и автоматически деплоит при каждом обновлении кода." },
  { term: "Lovable", category: "Инструменты", definition: "ИИ-платформа для создания сайтов без кода. Вставляете промпт — получаете готовый сайт с живой ссылкой за 1–2 минуты." },
  { term: "OpenRouter", category: "Инструменты", definition: "Агрегатор ИИ-моделей. Один API-ключ даёт доступ к десяткам моделей. Используется для подключения QWEN Code." },

  // Процесс
  { term: "Git", category: "Процесс", definition: "Система контроля версий. Отслеживает все изменения в коде и позволяет откатиться к любой предыдущей версии." },
  { term: "Коммит", category: "Процесс", definition: "Сохранение изменений в Git с описанием что было сделано. Как Ctrl+S, но с историей и комментарием." },
  { term: "Пуш", category: "Процесс", definition: "Отправка локального кода на GitHub. После пуша изменения видны в репозитории и Vercel запускает деплой." },
  { term: "Ветка", category: "Процесс", definition: "Отдельная линия разработки. Позволяет работать над новой функцией не ломая основной код." },
  { term: "Фронтенд", category: "Процесс", definition: "Часть приложения которую видит пользователь: интерфейс, кнопки, текст, анимации. Работает в браузере." },
  { term: "Бэкенд", category: "Процесс", definition: "Серверная часть приложения: база данных, авторизация, бизнес-логика. В MVP часто не нужен." },
  { term: "API", category: "Процесс", definition: "Application Programming Interface — интерфейс для взаимодействия между системами. Например, ИИ получает ваш запрос через API и возвращает ответ." },
  { term: "Переменная окружения", category: "Процесс", definition: "Секретные настройки приложения (API-ключи, пароли) которые хранятся отдельно от кода. Не попадают в GitHub." },

  // ИИ
  { term: "LLM", category: "ИИ", definition: "Large Language Model — большая языковая модель. Основа всех современных ИИ-ассистентов: Claude, GPT, QWEN." },
  { term: "Токены", category: "ИИ", definition: "Единицы измерения текста для ИИ. Примерно 1 токен = 0.75 слова. Подписки ограничены количеством токенов в месяц." },
  { term: "Системный промпт", category: "ИИ", definition: "Скрытая инструкция которая задаёт роль и правила поведения ИИ. Пользователь не видит системный промпт, но ИИ следует ему всегда." },
  { term: "Контекстное окно", category: "ИИ", definition: "Максимальный объём текста который ИИ держит в памяти за один разговор. Когда контекст заканчивается — начинайте новый чат." },
  { term: "Стриминг", category: "ИИ", definition: "Вывод текста ИИ в реальном времени по мере генерации. Вы видите ответ сразу, не ожидая пока ИИ закончит." },
  { term: "Галлюцинации", category: "ИИ", definition: "Когда ИИ уверенно выдаёт неверную информацию. Всегда проверяйте критически важные факты из ответов ИИ." },
  { term: "Температура", category: "ИИ", definition: "Параметр случайности ответов ИИ. Низкая температура — точные предсказуемые ответы. Высокая — более творческие." },

  // Код
  { term: "HTML", category: "Код", definition: "HyperText Markup Language — язык разметки веб-страниц. Определяет структуру: заголовки, параграфы, кнопки, формы." },
  { term: "CSS", category: "Код", definition: "Cascading Style Sheets — язык стилей. Управляет внешним видом: цвета, шрифты, отступы, анимации." },
  { term: "JavaScript", category: "Код", definition: "Язык программирования для браузера. Добавляет интерактивность: клики, фильтры, динамическое обновление данных." },
  { term: "JSON", category: "Код", definition: "JavaScript Object Notation — формат данных. Используется для передачи структурированной информации между системами. Именно в этом формате файлы news-data.json и kpi-data.json." },
  { term: "Адаптивность", category: "Код", definition: "Responsive Design — сайт хорошо выглядит на всех устройствах: телефоне, планшете, компьютере. Достигается через CSS медиа-запросы." },
  { term: "Консоль", category: "Код", definition: "Инструмент разработчика в браузере (F12). Показывает ошибки JavaScript и позволяет отлаживать код." },
  { term: "DOM", category: "Код", definition: "Document Object Model — представление HTML-страницы в памяти браузера. JavaScript изменяет DOM чтобы обновлять интерфейс без перезагрузки страницы." },
];

const CATEGORIES = ["Все", ...Array.from(new Set(TERMS.map((t) => t.category)))];

const CATEGORY_COLORS: Record<string, string> = {
  Основы: "#3b82f6",
  Инструменты: "#8b5cf6",
  Процесс: "#f59e0b",
  ИИ: "#00ffc2",
  Код: "#f06aa0",
};

export function Glossary() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return TERMS.filter((t) => {
      const matchesCategory = activeCategory === "Все" || t.category === activeCategory;
      const matchesQuery = !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  return (
    <div style={{ maxWidth: 900 }}>
      {/* Intro */}
      <p style={{ color: "var(--ws-muted)", fontSize: "0.9375rem", lineHeight: 1.6, marginBottom: 28 }}>
        Все ключевые термины вайб-кодинга в одном месте. Введите слово в поиск или выберите категорию.
      </p>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 20 }}>
        <Search
          size={16}
          style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--ws-muted)", pointerEvents: "none" }}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по терминам..."
          style={{
            width: "100%",
            height: 44,
            paddingLeft: 42,
            paddingRight: 16,
            background: "var(--ws-surface2)",
            border: "1px solid var(--ws-border)",
            borderRadius: 10,
            color: "var(--ws-text)",
            fontSize: "0.9375rem",
            fontFamily: "inherit",
            outline: "none",
            boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={(e) => { (e.target as HTMLElement).style.borderColor = "var(--ws-accent)"; }}
          onBlur={(e) => { (e.target as HTMLElement).style.borderColor = "var(--ws-border)"; }}
        />
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28 }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const color = cat === "Все" ? "var(--ws-accent)" : CATEGORY_COLORS[cat] ?? "var(--ws-accent)";
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `1px solid ${isActive ? color : "var(--ws-border)"}`,
                background: isActive ? `${color}18` : "transparent",
                color: isActive ? color : "var(--ws-muted)",
                fontSize: "0.8125rem",
                fontWeight: isActive ? 700 : 400,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Count */}
      <p style={{ fontSize: "0.8125rem", color: "var(--ws-muted)", marginBottom: 16 }}>
        {filtered.length === TERMS.length
          ? `${TERMS.length} терминов`
          : `${filtered.length} из ${TERMS.length}`}
      </p>

      {/* Terms grid */}
      {filtered.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--ws-muted)", fontSize: "0.9375rem" }}>
          Ничего не найдено. Попробуйте другой запрос.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 14,
          }}
        >
          {filtered.map((item) => {
            const color = CATEGORY_COLORS[item.category] ?? "var(--ws-accent)";
            return (
              <div
                key={item.term}
                style={{
                  background: "var(--ws-surface)",
                  border: "1px solid var(--ws-border)",
                  borderRadius: 12,
                  padding: "16px 18px",
                  transition: "border-color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = color; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ws-border)"; }}
              >
                {/* Category badge */}
                <span
                  style={{
                    display: "inline-block",
                    fontSize: "0.6875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color,
                    background: `${color}18`,
                    border: `1px solid ${color}40`,
                    borderRadius: 4,
                    padding: "2px 7px",
                    marginBottom: 10,
                  }}
                >
                  {item.category}
                </span>

                {/* Term */}
                <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: "1rem", color: "var(--ws-text)", letterSpacing: "-0.02em" }}>
                  {item.term}
                </p>

                {/* Definition */}
                <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--ws-muted)", lineHeight: 1.6 }}>
                  {item.definition}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
