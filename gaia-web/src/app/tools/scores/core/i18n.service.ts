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
    'events.open': 'Ouvrir {name}',
    'events.confirmDelete': 'Supprimer l’évènement « {name} » ?',
    'results.title': 'Résultats',
    'results.ranking': 'Classement',
    'results.rankingPending': 'Le classement sera disponible lorsque ses règles seront définies.',
    'results.loading': 'Chargement des résultats…',
    'results.missing': 'Cet évènement est introuvable.',
    'results.team': 'Équipe',
    'results.empty': 'Aucune équipe disponible.',
    'results.noGames': 'Certains jeux de cet évènement sont introuvables.',
    'results.save': 'Enregistrer',
    'results.saving': 'Enregistrement…',
    'results.edit': '{team} : {game}',
    'results.invalidTime': 'Saisissez un temps au format minutes:secondes, par exemple 02:14.',
    'results.invalidPoints': 'Saisissez un nombre de points positif ou nul.',
    'results.notSaved': 'Enregistrement impossible : {error}',
    'results.timeHint': 'min:sec',
    'results.notEntered': 'Non renseigné',
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
    'events.open': 'Ireki {name}',
    'events.confirmDelete': '"{name}" ekitaldia ezabatu?',
    'results.title': 'Emaitzak',
    'results.ranking': 'Sailkapena',
    'results.rankingPending': 'Sailkapena eskuragarri egonen da arauak zehazten direnean.',
    'results.loading': 'Emaitzak kargatzen…',
    'results.missing': 'Ekitaldi hau ez da aurkitu.',
    'results.team': 'Taldea',
    'results.empty': 'Ez dago talderik.',
    'results.noGames': 'Ekitaldi honetako joko batzuk ez dira aurkitu.',
    'results.save': 'Gorde',
    'results.saving': 'Gordetzen…',
    'results.edit': '{team}: {game}',
    'results.invalidTime': 'Sartu denbora minutu:segundo formatuan, adibidez 02:14.',
    'results.invalidPoints': 'Sartu zero edo gehiagoko puntu kopurua.',
    'results.notSaved': 'Ezin izan da gorde: {error}',
    'results.timeHint': 'min:seg',
    'results.notEntered': 'Bete gabe',
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
