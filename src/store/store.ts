import {ShortUserObject, UserObject} from "../types/objects_interfaces.ts";

let allowed_user_ids: ShortUserObject[] = [];

export function set_allowed_user_ids(user_ids: ShortUserObject[]): void {
    allowed_user_ids = user_ids;
}

export function get_allowed_user_ids(): ShortUserObject[] {
    return allowed_user_ids;
}

let allowed_notification_types: string[] = [];

export function set_allowed_notification_types(notification_types: string[]): void {
    if (allowed_notification_types.length > 0)
        return;
    allowed_notification_types = notification_types;
}

export function get_allowed_notification_types(): string[] {
    return allowed_notification_types;
}

let cur_user: UserObject | null;

export function set_cur_user(user: UserObject): void {
    cur_user = user;
}

export function get_cur_user(): UserObject | null {
    return cur_user;
}

export function clear_cur_user(): void {
    cur_user = null;
}

export const translated_types = new Map<string, string>([
    ["friend_request", "Заявка в друзья"],
    ["friend_request_accepted", "Принятие заявки"],
    ["new_subscriber", "Новый подписчик"],
    ["friend_invitation", "Приглашение друга"],
    ["found_acquaintance", "Найденный знакомый"],
    ["recommended_acquaintance", "Рекомендованный знакомый"],
    ["friend_birthday", "День рождения друга"],
    ["gift", "Подарок"],
    ["like", "Лайки"],
    ["reaction_on_post", "Реакция на пост"],
    ["reaction_on_photo", "Реакция на фото"],
    ["reaction_on_video", "Реакция на видео"],
    ["reaction_on_story", "Реакция на историю"],
    ["reaction_on_comment", "Реакция на комментарий"],
    ["reaction_on_product", "Реакция на товар"],
    ["repost", "Репост"],
    ["comment_on_post", "Комментарий к посту"],
    ["comment_on_photo", "Комментарий к фото"],
    ["comment_on_video", "Комментарий к видео"],
    ["comment_on_article", "Комментарий к статье"],
    ["comment_on_product", "Комментарий к товару"],
    ["reply_to_comment", "Ответ на комментарий"],
    ["author_mention", "Упоминание автора"],
    ["user_mention", "Упоминание пользователя"],
    ["photo_tag", "Отметка на фото"],
    ["post_mention", "Упоминание в посте"],
    ["comment_mention", "Упоминание в комментарии"],
    ["story_mention", "Упоминание в истории"],
    ["discussion_mention", "Упоминание в обсуждении"],
    ["story_question", "Вопрос в истории"],
    ["story_answer", "Ответ в истории"],
    ["new_post", "Новый пост"],
    ["new_photo", "Новое фото"],
    ["new_story", "Новая история"],
    ["new_video", "Новое видео"],
    ["new_clip", "Новый клип"],
    ["new_audio", "Новое аудио"],
    ["new_album", "Новый альбом"],
    ["new_podcast", "Новый подкаст"],
    ["new_playlist", "Новый плейлист"],
    ["stream_started", "Начало трансляции"],
    ["new_author_content", "Новый контент от автора"],
    ["new_community_content", "Новый контент от сообщества"],
    ["community_invitation", "Приглашение в сообщество"],
    ["join_request_accepted", "Принятие заявки на вступление"],
    ["role_changed", "Изменение роль"],
    ["co_owner_status_changed", "Изменение статуса совладельца"],
    ["new_community_subscriber", "Новый подписчик"],
    ["suggested_post", "Предложенный пост"],
    ["community_comment", "Комментарий на контент сообщества"],
    ["community_reaction", "Реакция на контент сообщества"],
    ["product_comment", "Комментарий к товару"],
    ["product_review", "Отзыв о товаре"],
    ["review_published", "Публикация отзыва"],
    ["review_rejected", "Отклонение отзыва"],
    ["order_status_changed", "Изменение статуса доставки"],
    ["abandoned_cart_reminder", "Напоминание о незавершённой покупке"],
    ["delivery_info", "Информация о доставке"],
    ["money_request", "Запрос денег"],
    ["money_transfer", "Перевод денег"],
    ["balance_changed", "Изменение баланса"],
    ["payment_state_changed", "Изменение статуса платежа"],
    ["subscription_purchased", "Оформление подписки"],
    ["subscription_renewed", "Продление подписки"],
    ["payment_error", "Ошибка оплаты"],
    ["account_changed", "Важное изменение аккаунта"],
    ["data_verification", "Проверка данных"],
    ["phone_linked", "Привязка телефона"],
    ["phone_unlinked", "Отвязка телефона"],
    ["email_linked", "Привязка почты"],
    ["email_unlinked", "Отвязка почты"],
    ["security_warning", "Предупреждения о безопасности"],
    ["access_restricted", "Ограничение доступа"],
    ["access_restored", "Восстановление доступа"],
    ["event_starting_soon", "Скоро начнётся событие"],
    ["call_starting_soon", "Скоро начнётся звонок"],
    ["birthday_reminder", "Напоминание о дне рождения"],
    ["saved_wish_reminder", "Напоминание о сохранённом желании"],
    ["people_recommendation", "Рекомендации людей"],
    ["communities_recommendation", "Рекомендации сообществ"],
    ["publications_recommendation", "Рекомендации публикаций"],
    ["return_to_content_reminder", "Напоминание вернуться к контенту"],
    ["support_reply", "Ответ поддержки"],
    ["app_notification", "Уведомления приложений"],
    ["service_notification", "Уведомления сервисов"],
    ["game_achievement", "Достижения в играх"],
    ["promo_selection", "Промо-подборки"],
    ["new_feature_offer", "Новые функции"],
]);

export const translated_clusters = new Map<string, string>([
    ["friends_and_subscriptions", "Друзья и подписки"],
    ["content_reactions", "Реакции на контент"],
    ["comments_and_replies", "Комментарии и ответы"],
    ["mentions_and_tags", "Отметки и упоминания"],
    ["new_publications_and_media", "Новые публикации и медиа"],
    ["communities_and_management", "Сообщества и управление ими"],
    ["shop_and_orders", "Магазин и заказы"],
    ["payments_and_subscriptions", "Деньги и подписки"],
    ["security_and_account_state", "Безопасность и состояние аккаунта"],
    ["events_reminders_and_recommendations", "События, напоминания и рекомендации"],
    ["service_and_promo_messages", "Сервисные и рекламные сообщения"],
    ["important", "Важное"],
]);
