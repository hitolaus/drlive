/*global test:true, equal:true*/
test('Parse XML Date', function() {
    var xmlDate = Date.parseXmlDate('1970-01-01T01:00:00+02:00');

    equal(xmlDate.getYear(), '70', 'Incorrect year');
    equal(xmlDate.getMonth(), '1', 'Incorrect month');
    equal(xmlDate.getDay(), '0', 'Incorrect day');
});

test('Format Time', function() {

    var time = new Date();
    time.setHours(11);
    time.setMinutes(0);
    
    equal('11:00', time.getFormattedTime());
});