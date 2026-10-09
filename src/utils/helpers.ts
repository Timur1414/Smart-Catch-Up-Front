import Handlebars from 'handlebars';

Handlebars.registerHelper('equal', function (a, b): boolean {
    return a === b;
});
