export default class EventsPubSub {
    events = {};

    sub(eventName, func) {
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push(func);
    }

    unsub(eventName, func) {
        if (this.events[eventName])
            for (var i = 0; i < this.events[eventName].length; i++)
                if (this.events[eventName][i] === func) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
    }

    emit(eventName, data) {
        if (this.events[eventName])
            this.events[eventName].forEach(function (func) {
                func(data);
            });
    }
}

/*
#######################################
     EVENTS
#######################################

    {
        event:          onSectionRest
        desciption:     Called when the section change animation stops
        parameters:     {section}
        section:        Number of the new section
    },
*/
