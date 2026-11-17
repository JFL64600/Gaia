import { Injectable, inject } from '@angular/core';
import { PreferencesService } from '../../../preferences/preferences.service';

const MESSAGES = {
  fr: {
    'events.new': 'Nouvel évènement',
    'events.name': 'Nom de l’évènement',
    'events.teams': 'Nombre d’équipes',
    'events.teamsHint': 'Un nombre entier entre 1 et 100.',
    'events.games': 'Jeux',
    'events.gamesHint': 'Sélectionnez un ou plusieurs jeux.',
    'events.gamesLoading': 'Chargement des jeux…',
    'games.role.time': 'Temps',
    'games.role.point': 'Points',
    'events.nameHint': 'Choisissez un nom pour identifier votre évènement.',
    'events.namePlaceholder': 'Ex. : Tournoi de printemps',
    'events.saving': 'Enregistrement…',
    'events.delete': 'Supprimer {name}',
    'common.add': 'Ajouter',
    'common.cancel': 'Annuler',
  },
  eu: {
    'events.new': 'Ekitaldi berria',
    'events.name': 'Ekitaldiaren izena',
    'events.teams': 'Talde kopurua',
    'events.teamsHint': '1 eta 100 arteko zenbaki oso bat.',
    'events.games': 'Jokoak',
    'events.gamesHint': 'Hautatu joko bat edo gehiago.',
    'events.gamesLoading': 'Jokoak kargatzen…',
    'games.role.time': 'Denbora',
    'games.role.point': 'Puntuak',
    'events.nameHint': 'Aukeratu izen bat zure ekitaldia identifikatzeko.',
    'events.namePlaceholder': 'Adibidez: Udaberriko txapelketa',
    'events.saving': 'Gordetzen…',
    'events.delete': 'Ezabatu {name}',
    'common.add': 'Gehitu',
    'common.cancel': 'Utzi',
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)['fr'];

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly preferences = inject(PreferencesService);
  readonly language = this.preferences.language;

  t(key: MessageKey, params: Record<string, string | number> = {}): string {
    return MESSAGES[this.language()][key].replace(/\{(\w+)\}/g, (placeholder, name: string) =>
      String(params[name] ?? placeholder),
    );
  }
}
