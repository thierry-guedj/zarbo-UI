<template>
  <section>
    <v-btn
      v-show="fab"
      v-scroll="onScroll"
      fab
      dark
      fixed
      bottom
      right
      color="accent"
      @click="toTop"
    >
      <v-icon>keyboard_arrow_up</v-icon>
    </v-btn>
    <v-container class="p-0 m-0 row-designs">
      <section class="hero text-white">
        <v-row class="row-md-12">
          <v-col class="col-md-2 text-center iconTitle">
            <img src="/cguIcon.png" class="ml-3 mr-2"
          /></v-col>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-col class="col-md-9">
            <p class="titlePage text-white">
              {{ $t('footer.cgu') }}
            </p>
          </v-col>
        </v-row>
      </section>
    </v-container>
    <div class="px-4">
      <h2>Définitions</h2>
      <p>
        <b>Client&nbsp;:</b>&nbsp;tout professionnel ou personne physique
        capable au sens des articles 1123 et suivants du Code civil, ou personne
        morale, qui visite le Site objet des présentes conditions générales.<br />
        <b>Prestations et Services&nbsp;:</b>
        <a href="https://zarbo.fr">https://zarbo.fr</a> met à disposition des
        Clients&nbsp;:
      </p>

      <p>
        <b>Contenu&nbsp;:</b>&nbsp;Ensemble des éléments constituants
        l’information présente sur le Site, notamment textes – images – vidéos.
      </p>

      <p>
        <b>Informations clients&nbsp;:</b> Ci après dénommé «&nbsp;Information
        (s)&nbsp;» qui correspondent à l’ensemble des données personnelles
        susceptibles d’être détenues par
        <a href="https://zarbo.fr">https://zarbo.fr</a> pour la gestion de votre
        compte, de la gestion de la relation client et à des fins d’analyses et
        de statistiques.
      </p>

      <p>
        <b>Utilisateur :</b> Internaute se connectant, utilisant le site
        susnommé.
      </p>
      <p>
        <b>Informations personnelles :</b> « Les informations qui permettent,
        sous quelque forme que ce soit, directement ou non, l'identification des
        personnes physiques auxquelles elles s'appliquent » (article 4 de la loi
        n° 78-17 du 6 janvier 1978).
      </p>
      <p>
        Les termes «&nbsp;données à caractère personnel&nbsp;», «&nbsp;personne
        concernée&nbsp;», «&nbsp;sous traitant&nbsp;» et «&nbsp;données
        sensibles&nbsp;» ont le sens défini par le Règlement Général sur la
        Protection des Données (RGPD&nbsp;: n° 2016-679)
      </p>

      <h2>1. Présentation du site internet.</h2>
      <p>
        En vertu de l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la
        confiance dans l'économie numérique, il est précisé aux utilisateurs du
        site internet&nbsp;<a href="https://zarbo.fr">https://zarbo.fr</a
        >&nbsp;l'identité des différents intervenants dans le cadre de sa
        réalisation et de son suivi:
      </p>
      <p>
        <strong>Propriétaire</strong> : Thierry Guedj – 11, route du Castera
        31310 Montesquieu Volvestre<br />

        <strong>Responsable publication</strong> : Thierry Guedj –
        info@zarbo.fr<br />
        Le responsable publication est une personne physique ou une personne
        morale.<br />
        <strong>Webmaster</strong> : Thierry Guedj – info@zarbo.fr<br />
        <strong>Hébergeur</strong> : ovh – 2 rue Kellermann 59100 Roubaix
        1007<br />
        <strong>Délégué à la protection des données</strong> : Thierry Guedj –
        info@zarbo.fr<br />
      </p>

      <div ng-bind-html="linkHTML">
        <p>
          Ces mentions légales RGPD sont issues du
          <a
            href="https://fr.orson.io/1371/generateur-mentions-legales"
            title="générateur gratuit de mentions légales pour un site internet"
            >générateur gratuit de mentions légales pour un site internet</a
          >
        </p>
      </div>

      <h2>
        2. Conditions générales d’utilisation du site et des services proposés.
      </h2>

      <p>
        Le Site constitue une œuvre de l’esprit protégée par les dispositions du
        Code de la Propriété Intellectuelle et des Réglementations
        Internationales applicables. Le Client ne peut en aucune manière
        réutiliser, céder ou exploiter pour son propre compte tout ou partie des
        éléments ou travaux du Site.
      </p>

      <p>
        L’utilisation du site&nbsp;<a href="https://zarbo.fr"
          >https://zarbo.fr</a
        >&nbsp;implique l’acceptation pleine et entière des conditions générales
        d’utilisation ci-après décrites. Ces conditions d’utilisation sont
        susceptibles d’être modifiées ou complétées à tout moment, les
        utilisateurs du site&nbsp;<a href="https://zarbo.fr">https://zarbo.fr</a
        >&nbsp;sont donc invités à les consulter de manière régulière.
      </p>

      <p>
        Ce site internet est normalement accessible à tout moment aux
        utilisateurs. Une interruption pour raison de maintenance technique peut
        être toutefois décidée par
        <a href="https://zarbo.fr">https://zarbo.fr</a>, qui s’efforcera alors
        de communiquer préalablement aux utilisateurs les dates et heures de
        l’intervention. Le site web&nbsp;<a href="https://zarbo.fr"
          >https://zarbo.fr</a
        >&nbsp;est mis à jour régulièrement. De la même façon, les mentions
        légales peuvent être modifiées à tout moment : elles s’imposent
        néanmoins à l’utilisateur qui est invité à s’y référer le plus souvent
        possible afin d’en prendre connaissance.
      </p>

      <h2>3. Description des services fournis.</h2>

      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> s’efforce de fournir sur
        le site&nbsp;<a href="https://zarbo.fr">https://zarbo.fr</a>&nbsp;des
        informations aussi précises que possible. Toutefois, il ne pourra être
        tenu responsable des oublis, des inexactitudes et des carences dans la
        mise à jour, qu’elles soient de son fait ou du fait des tiers
        partenaires qui lui fournissent ces informations.
      </p>

      <p>
        Toutes les informations indiquées sur le site&nbsp;<a
          href="https://zarbo.fr"
          >https://zarbo.fr</a
        >&nbsp;sont données à titre indicatif, et sont susceptibles d’évoluer.
        Par ailleurs, les renseignements figurant sur le site&nbsp;<a
          href="https://zarbo.fr"
          >https://zarbo.fr</a
        >&nbsp;ne sont pas exhaustifs. Ils sont donnés sous réserve de
        modifications ayant été apportées depuis leur mise en ligne.
      </p>

      <h2>4. Limitations contractuelles sur les données techniques.</h2>

      <p>
        Le site utilise la technologie JavaScript. Le site Internet ne pourra
        être tenu responsable de dommages matériels liés à l’utilisation du
        site. De plus, l’utilisateur du site s’engage à accéder au site en
        utilisant un matériel récent, ne contenant pas de virus et avec un
        navigateur de dernière génération mis-à-jour Le site
        <a href="https://zarbo.fr">https://zarbo.fr</a> est hébergé chez un
        prestataire sur le territoire de l’Union Européenne conformément aux
        dispositions du Règlement Général sur la Protection des Données
        (RGPD&nbsp;: n° 2016-679)
      </p>

      <p>
        L’objectif est d’apporter une prestation qui assure le meilleur taux
        d’accessibilité. L’hébergeur assure la continuité de son service 24
        Heures sur 24, tous les jours de l’année. Il se réserve néanmoins la
        possibilité d’interrompre le service d’hébergement pour les durées les
        plus courtes possibles notamment à des fins de maintenance,
        d’amélioration de ses infrastructures, de défaillance de ses
        infrastructures ou si les Prestations et Services génèrent un trafic
        réputé anormal.
      </p>

      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> et l’hébergeur ne
        pourront être tenus responsables en cas de dysfonctionnement du réseau
        Internet, des lignes téléphoniques ou du matériel informatique et de
        téléphonie lié notamment à l’encombrement du réseau empêchant l’accès au
        serveur.
      </p>

      <h2>5. Propriété intellectuelle.</h2>
      <h3>5.1 Contenu du site</h3>
      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> est propriétaire des
        droits de propriété intellectuelle et détient les droits d’usage sur
        tous les éléments accessibles sur le site internet, notamment les
        textes, images, graphismes, logos, vidéos, icônes et sons. Toute
        reproduction, représentation, modification, publication, adaptation de
        tout ou partie des éléments du site, quel que soit le moyen ou le
        procédé utilisé, est interdite, sauf autorisation écrite préalable de :
        <a href="https://zarbo.fr">https://zarbo.fr</a>.
      </p>

      <p>
        Toute exploitation non autorisée du site ou de l’un quelconque des
        éléments qu’il contient sera considérée comme constitutive d’une
        contrefaçon et poursuivie conformément aux dispositions des articles
        L.335-2 et suivants du Code de Propriété Intellectuelle.
      </p>
      <h3>5.2 Contenu Utilisateur</h3>
      <p>
        Toutes les photos, images et autre contenu
        t&eacute;l&eacute;charg&eacute;s sur le site par les Utilisateurs
        (&laquo;&nbsp;Contenu Utilisateur&nbsp;&raquo;) demeurent la
        propri&eacute;t&eacute; de leurs propri&eacute;taires respectifs.
      </p>
      <p>
        Les Contenus Utilisateur sont destin&eacute;s &agrave; &ecirc;tre
        publi&eacute;s par Zarbo , &agrave; des fins de promotion, mise en avant
        sur le site Zarbo pour le compte de l&rsquo;Utilisateur.
      </p>
      <h3>5.3 Limites d&rsquo;utilisation</h3>
      <p>
        L&rsquo;Utilisateur accepte de ne pas utiliser le site ou tout produit
        ou service disponible sur le site pour toute fin ill&eacute;gale ou
        interdite par ces conditions g&eacute;n&eacute;rales.
        L&rsquo;Utilisateur accepte de ne publier ni fournir au site aucun
        Contenu Utilisateur ou autre mat&eacute;riel qui (a) enfreindrait les
        droits d&rsquo;auteur, la marque d&eacute;pos&eacute;e, le secret
        commercial ou d&rsquo;autres droits de propri&eacute;t&eacute;
        d&rsquo;autres parties; (b) violerait la vie priv&eacute;e ou les droits
        de publicit&eacute; ou d&rsquo;autres droits personnels d&rsquo;autres
        parties; (c) serait obsc&egrave;ne, diffamatoire, mena&ccedil;ant,
        harcelant, abusif, haineux, ou embarrassant pour une autre partie; ou
        (d) usurperait l&rsquo;identit&eacute; d&rsquo;une autre personne.
        L&rsquo;Utilisateur s&rsquo;engage &eacute;galement &agrave; ne fournir
        aucun Contenu Utilisateur ou autre mat&eacute;riel contenant des virus,
        chevaux de Troie, vers, bombes &agrave; retardement, robots
        d&rsquo;annulation ou d&rsquo;autres routines de programmation ou
        moteurs informatiques destin&eacute;s &agrave; endommager,
        interf&eacute;rer de fa&ccedil;on pr&eacute;judiciable avec, intercepter
        ou exproprier subrepticement tout syst&egrave;me, donn&eacute;e ou
        information. L&rsquo;Utilisateur s&rsquo;engage &agrave; ne pas tenter
        d&rsquo;avoir acc&egrave;s sans autorisation au site ou &agrave; tout
        produit ou service disponible sur le site, &agrave; d&rsquo;autres
        comptes, syst&egrave;mes ou r&eacute;seaux informatiques
        connect&eacute;s au site, par piratage, extraction de mot de passe,
        usurpation d&rsquo;identit&eacute;, utilisation non autoris&eacute;e du
        nom d&rsquo;Utilisateur, du mot de passe ou d&rsquo;autres informations
        d&rsquo;une autre personne, ou tout autre moyen. L&rsquo;Utilisateur
        s&rsquo;engage &agrave; n&rsquo;utiliser aucun robot, araign&eacute;e,
        ou autre dispositif automatique, ou proc&eacute;d&eacute; manuel pour
        contr&ocirc;ler ou copier des pages du site ou le contenu de celui-ci
        sans la permission pr&eacute;alable &eacute;crite et explicite de Zarbo
        . L&rsquo;Utilisateur s&rsquo;engage &agrave; ce que toute information
        d&rsquo;identification fournie au site (y compris, sans limitation, nom
        et adresse email) soit compl&egrave;te, exacte et sinc&egrave;re. Zarbo
        a le droit, mais non l&rsquo;obligation, de contr&ocirc;ler,
        &eacute;diter ou supprimer tout contenu du site qui, &agrave; sa seule
        discr&eacute;tion, est inacceptable, ind&eacute;sirable,
        inappropri&eacute; ou en violation de ces conditions
        g&eacute;n&eacute;rales.
      </p>
      <h2>6. Limitations de responsabilité.</h2>

      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> agit en tant qu’éditeur
        du site. <a href="https://zarbo.fr">https://zarbo.fr</a> &nbsp;est
        responsable de la qualité et de la véracité du Contenu qu’il publie.
      </p>

      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> ne pourra être tenu
        responsable des dommages directs et indirects causés au matériel de
        l’utilisateur, lors de l’accès au site internet
        <a href="https://zarbo.fr">https://zarbo.fr</a>, et résultant soit de
        l’utilisation d’un matériel ne répondant pas aux spécifications
        indiquées au point 4, soit de l’apparition d’un bug ou d’une
        incompatibilité.
      </p>

      <p>
        <a href="https://zarbo.fr">https://zarbo.fr</a> ne pourra également être
        tenu responsable des dommages indirects (tels par exemple qu’une perte
        de marché ou perte d’une chance) consécutifs à l’utilisation du
        site&nbsp;<a href="https://zarbo.fr">https://zarbo.fr</a>. Des espaces
        interactifs (possibilité de poser des questions dans l’espace contact)
        sont à la disposition des utilisateurs.
        <a href="https://zarbo.fr">https://zarbo.fr</a> se réserve le droit de
        supprimer, sans mise en demeure préalable, tout contenu déposé dans cet
        espace qui contreviendrait à la législation applicable en France, en
        particulier aux dispositions relatives à la protection des données. Le
        cas échéant, <a href="https://zarbo.fr">https://zarbo.fr</a> se réserve
        également la possibilité de mettre en cause la responsabilité civile
        et/ou pénale de l’utilisateur, notamment en cas de message à caractère
        raciste, injurieux, diffamant, ou pornographique, quel que soit le
        support utilisé (texte, photographie …).
      </p>

      <h2>7. Droit applicable et attribution de juridiction.</h2>
      <p>
        Tout litige en relation avec l’utilisation du site&nbsp;<a
          href="https://zarbo.fr"
          >https://zarbo.fr</a
        >&nbsp;est soumis au droit français. En dehors des cas où la loi ne le
        permet pas, il est fait attribution exclusive de juridiction aux
        tribunaux compétents de toulouse
      </p>
      <base-modal :dialog.sync="visible" @closeDialog="hideModal()" />
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Cgu',
  scrollToTop: true,
  layout: 'designs-listing',
  data() {
    return {
      fab: false,
    }
  },
  computed: {
    ...mapGetters(['visible']),
  },

  mounted() {
    this.toTop()
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
  },
}
</script>

<style lang="scss" scoped></style>
