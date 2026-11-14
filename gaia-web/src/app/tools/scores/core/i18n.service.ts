import { Injectable, inject } from '@angular/core';
import { Language, PreferencesService } from '../../../preferences/preferences.service';

const MESSAGES = {
  fr: {
    'language.label': 'Langue',
    'theme.label': 'Thème',
    'theme.forest': 'Forêt',
    'theme.basque': 'Basque',
    'theme.ocean': 'Océan',
    'theme.purple': 'Violet',
    'theme.sunset': 'Coucher de soleil',
    'theme.dark': 'Sombre',
    'events.eyebrow': 'Votre espace GaiaScores',
    'events.title': 'Évènements',
    'events.description': 'Retrouvez et gérez vos évènements au même endroit.',
    'events.search': 'Rechercher un évènement',
    'events.count.single': 'évènement',
    'events.count.plural': 'évènements',
    'events.create': 'Créer un évènement',
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
    'events.empty': 'Aucun évènement pour le moment',
    'events.emptyHint': 'Créez votre premier évènement pour commencer.',
    'events.noResults': 'Aucun évènement trouvé',
    'events.noResultsHint': 'Essayez avec un autre nom.',
    'events.loading': 'Chargement des évènements…',
    'events.connectionError': 'La connexion à Firebase a échoué.',
    'events.saving': 'Enregistrement…',
    'common.add': 'Ajouter',
    'common.cancel': 'Annuler',
  },
  eu: {
    'language.label': 'Hizkuntza',
    'theme.label': 'Gaia',
    'theme.forest': 'Basoa',
    'theme.basque': 'Euskal',
    'theme.ocean': 'Ozeanoa',
    'theme.purple': 'Morea',
    'theme.sunset': 'Ilunabarra',
    'theme.dark': 'Iluna',
    'events.eyebrow': 'Zure GaiaScores gunea',
    'events.title': 'Ekitaldiak',
    'events.description': 'Aurkitu eta kudeatu zure ekitaldiak leku bakarrean.',
    'events.search': 'Bilatu ekitaldiak',
    'events.count.single': 'ekitaldi',
    'events.count.plural': 'ekitaldi',
    'events.create': 'Sortu ekitaldia',
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
    'events.empty': 'Oraindik ez dago ekitaldirik',
    'events.emptyHint': 'Sortu zure lehen ekitaldia hasteko.',
    'events.noResults': 'Ez da ekitaldirik aurkitu',
    'events.noResultsHint': 'Saiatu beste izen batekin.',
    'events.loading': 'Ekitaldiak kargatzen…',
    'events.connectionError': 'Ezin izan da Firebase-ra konektatu.',
    'events.saving': 'Gordetzen…',
    'common.add': 'Gehitu',
    'common.cancel': 'Utzi',
  },
} as const;

export type MessageKey = keyof (typeof MESSAGES)['fr'];

@Injectable({ providedIn: 'root' })
export class I18n {
  private readonly preferences = inject(PreferencesService);
  readonly language = this.preferences.language;

  t(key: MessageKey): string {
    return MESSAGES[this.language()][key];
  }

  setLanguage(language: Language): void {
    this.preferences.setLanguage(language);
  }
}
