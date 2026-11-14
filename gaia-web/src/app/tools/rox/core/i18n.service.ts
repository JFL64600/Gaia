import { Injectable, inject } from '@angular/core';
import { Language, PreferencesService } from '../../../preferences/preferences.service';

const MESSAGES = {
  fr: {
    'language.label': 'Langue',
    'chronometers.label': 'Chronomètres',
    'chronometer.defaultName': 'Chronomètre {n}',
    'chronometer.elapsed': 'Temps écoulé {time}',
    'chronometer.start': 'Démarrer',
    'chronometer.stop': 'Arrêter',
    'chronometer.resume': 'Reprendre',
    'chronometer.startNamed': 'Démarrer {name}',
    'chronometer.stopNamed': 'Arrêter {name}',
    'chronometer.resumeNamed': 'Reprendre {name}',
    'chronometer.add': 'Ajouter un chronomètre',
    'chronometer.new': 'Nouveau chronomètre',
    'chronometer.name': "Nom de l'équipe",
    'chronometer.nameUsed': 'Ce nom est déjà utilisé.',
    'events.label': 'Événements',
    'events.empty': "Aucun événement pour l'instant.",
    'events.add': 'Créer un événement',
    'events.new': 'Nouvel événement',
    'events.name': "Nom de l'événement",
    'events.search': 'Rechercher par nom',
    'events.open': 'Ouvrir {name}',
    'events.delete': 'Supprimer {name}',
    'events.confirmDelete': 'Supprimer l’événement « {name} » ?',
    'events.code': 'Code :',
    'events.resume': 'Afficher le bouton Reprendre',
    'common.add': 'Ajouter',
    'common.cancel': 'Annuler',
    'sync.label': 'Synchronisation cloud',
    'sync.inRoom': 'Synchronisé dans la salle',
    'sync.copyLink': 'Copier le lien de partage',
    'sync.leave': 'Quitter la salle',
    'sync.error': 'Synchronisation impossible. Vérifiez la connexion.',
    'sync.roomCode': 'Code de salle',
    'sync.join': 'Rejoindre la salle',
    'sync.newCode': 'Nouveau code',
    'theme.label': 'Thème',
    'theme.forest': 'Forêt',
    'theme.basque': 'Basque',
    'theme.ocean': 'Océan',
    'theme.purple': 'Violet',
    'theme.sunset': 'Coucher de soleil',
    'theme.dark': 'Sombre',
    'ranking.title': 'Classement',
    'startup.waiting': 'En attente du démarrage…',
    'chronometers.waiting': 'En attente des équipes…',
    'ranking.waiting': 'En attente du classement…',
    'ranking.style': 'Style du classement',
    'ranking.podium': 'Podium',
    'ranking.hero': 'Vedette',
    'ranking.medals': 'Médailles',
  },
  eu: {
    'language.label': 'Hizkuntza',
    'chronometers.label': 'Kronometroak',
    'chronometer.defaultName': '{n}. kronometroa',
    'chronometer.elapsed': 'Igarotako denbora {time}',
    'chronometer.start': 'Hasi',
    'chronometer.stop': 'Gelditu',
    'chronometer.resume': 'Berrekin',
    'chronometer.startNamed': 'Hasi {name}',
    'chronometer.stopNamed': 'Gelditu {name}',
    'chronometer.resumeNamed': 'Berrekin {name}',
    'chronometer.add': 'Gehitu kronometroa',
    'chronometer.new': 'Kronometro berria',
    'chronometer.name': 'Taldearen izena',
    'chronometer.nameUsed': 'Izen hau jada erabilita dago.',
    'events.label': 'Ekitaldiak',
    'events.empty': 'Oraindik ez dago ekitaldirik.',
    'events.add': 'Sortu ekitaldia',
    'events.new': 'Ekitaldi berria',
    'events.name': 'Ekitaldiaren izena',
    'events.search': 'Bilatu izenez',
    'events.open': 'Ireki {name}',
    'events.delete': 'Ezabatu {name}',
    'events.confirmDelete': '"{name}" ekitaldia ezabatu?',
    'events.code': 'Kodea:',
    'events.resume': 'Erakutsi berrekin botoia',
    'common.add': 'Gehitu',
    'common.cancel': 'Utzi',
    'sync.label': 'Hodeiko sinkronizazioa',
    'sync.inRoom': 'Gelan sinkronizatuta',
    'sync.copyLink': 'Kopiatu partekatzeko esteka',
    'sync.leave': 'Irten gelatik',
    'sync.error': 'Ezin da sinkronizatu. Egiaztatu konexioa.',
    'sync.roomCode': 'Gelaren kodea',
    'sync.join': 'Sartu gelan',
    'sync.newCode': 'Kode berria',
    'theme.label': 'Gaia',
    'theme.forest': 'Basoa',
    'theme.basque': 'Euskal',
    'theme.ocean': 'Ozeanoa',
    'theme.purple': 'More',
    'theme.sunset': 'Ilunabarra',
    'theme.dark': 'Iluna',
    'ranking.title': 'Sailkapena',
    'startup.waiting': 'Hasierara itxaroten…',
    'chronometers.waiting': 'Taldeen zain…',
    'ranking.waiting': 'Sailkapenaren zain…',
    'ranking.style': 'Sailkapenaren estiloa',
    'ranking.podium': 'Podiuma',
    'ranking.hero': 'Nagusia',
    'ranking.medals': 'Dominak',
  },
} as const satisfies Record<Language, Record<string, string>>;

export type MessageKey = keyof (typeof MESSAGES)['fr'];

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly preferences = inject(PreferencesService);
  readonly language = this.preferences.language;

  /** Reads the active language signal, so templates re-render when it changes. */
  t(key: MessageKey, params: Record<string, string | number> = {}): string {
    return MESSAGES[this.language()][key].replace(/\{(\w+)\}/g, (_, name: string) =>
      String(params[name] ?? ''),
    );
  }

  /** Changes the language and remembers it on this device. */
  setLanguage(language: Language): void {
    this.preferences.setLanguage(language);
  }
}
