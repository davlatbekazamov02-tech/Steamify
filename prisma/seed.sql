INSERT INTO "Region" (id, name, slug) VALUES
('toshkent-shahri',   'Toshkent shahri',       'toshkent-shahri'),
('toshkent-viloyati', 'Toshkent viloyati',      'toshkent-viloyati'),
('andijon',           'Andijon viloyati',       'andijon'),
('buxoro',            'Buxoro viloyati',        'buxoro'),
('fargona',           'Farg''ona viloyati',     'fargona'),
('jizzax',            'Jizzax viloyati',        'jizzax'),
('xorazm',            'Xorazm viloyati',        'xorazm'),
('namangan',          'Namangan viloyati',      'namangan'),
('navoiy',            'Navoiy viloyati',        'navoiy'),
('qashqadaryo',       'Qashqadaryo viloyati',   'qashqadaryo'),
('samarqand',         'Samarqand viloyati',     'samarqand'),
('sirdaryo',          'Sirdaryo viloyati',      'sirdaryo'),
('surxondaryo',       'Surxondaryo viloyati',   'surxondaryo'),
('qoraqalpogiston',   'Qoraqalpog''iston',      'qoraqalpogiston')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "SystemSetting" (id, "attendanceXp", "winnerXp", "bestDebaterXp", "referralXp", "platformName", "applicationsEnabled", "registrationOpen", "updatedAt") VALUES
('default', 10, 50, 30, 5, 'STEAMIFY', false, true, NOW())
ON CONFLICT (id) DO NOTHING;
