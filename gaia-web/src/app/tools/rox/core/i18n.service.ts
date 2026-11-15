import { Injectable, inject } from '@angular/core';
import { Language, PreferencesService } from '../../../preferences/preferences.service';

const MESSAGES = {
  fr: {
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
    'events.new': 'Nouvel événement',
    'events.nameHint': 'Choisissez un nom pour identifier votre événement.',
    'events.namePlaceholder': 'Ex. : Tournoi de printemps',
    'events.name': "Nom de l'événement",
    'events.open': 'Ouvrir {name}',
    'events.delete': 'Supprimer {name}',
    'events.confirmDelete': 'Supprimer l’événement « {name} » ?',
    'events.resume': 'Afficher le bouton Reprendre',
    'common.add': 'Ajouter',
    'common.cancel': 'Annuler',
    'sync.copyLink': 'Copier le lien de partage',
    'sync.error': 'Synchronisation impossible. Vérifiez la connexion.',
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
    'events.new': 'Ekitaldi berria',
    'events.nameHint': 'Aukeratu izen bat zure ekitaldia identifikatzeko.',
    'events.namePlaceholder': 'Adibidez: Udaberriko txapelketa',
    'events.name': 'Ekitaldiaren izena',
    'events.open': 'Ireki {name}',
    'events.delete': 'Ezabatu {name}',
    'events.confirmDelete': '"{name}" ekitaldia ezabatu?',
    'events.resume': 'Erakutsi berrekin botoia',
    'common.add': 'Gehitu',
    'common.cancel': 'Utzi',
    'sync.copyLink': 'Kopiatu partekatzeko esteka',
    'sync.error': 'Ezin da sinkronizatu. Egiaztatu konexioa.',
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
}
