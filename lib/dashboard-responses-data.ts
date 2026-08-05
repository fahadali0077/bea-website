export interface ResponseItem {
  id: string;
  rank: string;
  subtitle: string;
  promptTitle: string;
  text: string;
  likes: number;
  userName: string;
  school: string;
  commentsCount: number;
  trophyText: string;
  avatarSrc: string;
}

export type ResponseScope = "school" | "market" | "national";

const schoolTemplates: Omit<ResponseItem, "id">[] = [
  {
    rank: "#1 UConn",
    subtitle: "Your campus",
    promptTitle: "A random fact I love is..",
    text: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh",
    likes: 512,
    userName: "Ron",
    school: "Northeastern",
    commentsCount: 0,
    trophyText: "Top School Response wins 3 months of Bea Premium",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#2 UConn",
    subtitle: "Your campus",
    promptTitle: "A random fact I love is..",
    text: "The library basement has the best study nooks nobody talks about.",
    likes: 478,
    userName: "Maya S.",
    school: "Northeastern",
    commentsCount: 2,
    trophyText: "Top School Response wins 3 months of Bea Premium",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#3 UConn",
    subtitle: "Your campus",
    promptTitle: "My weekend plans include..",
    text: "Farmers market run, then catching the sunset at the harbor.",
    likes: 445,
    userName: "Alex T.",
    school: "Northeastern",
    commentsCount: 1,
    trophyText: "Top School Response wins 3 months of Bea Premium",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#4 UConn",
    subtitle: "Your campus",
    promptTitle: "What's your ideal first date",
    text: "Coffee walk through the arboretum followed by homemade pasta.",
    likes: 401,
    userName: "Jordan P.",
    school: "Northeastern",
    commentsCount: 3,
    trophyText: "Top School Response wins 3 months of Bea Premium",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#5 UConn",
    subtitle: "Your campus",
    promptTitle: "A random fact I love is..",
    text: "Our campus squirrel population has its own unofficial Instagram.",
    likes: 389,
    userName: "Sam L.",
    school: "Northeastern",
    commentsCount: 5,
    trophyText: "Top School Response wins 3 months of Bea Premium",
    avatarSrc: "/images/ron-avatar.png",
  },
];

const marketTemplates: Omit<ResponseItem, "id">[] = [
  {
    rank: "#1 BU",
    subtitle: "Boston market",
    promptTitle: "My favorite local spot is..",
    text: "Tatte Bakery on a Sunday morning. The shakshuka is incredible and the vibes are unmatched.",
    likes: 342,
    userName: "Dan K.",
    school: "Boston University",
    commentsCount: 4,
    trophyText: "Top Market Response wins a free dinner date",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#2 Harvard",
    subtitle: "Boston market",
    promptTitle: "A random fact I love is..",
    text: "Harvard Yard was once used to graze cattle. Now it is just students grazing on coffee.",
    likes: 289,
    userName: "Julia R.",
    school: "Harvard",
    commentsCount: 2,
    trophyText: "Top Market Response wins a free dinner date",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#3 BC",
    subtitle: "Boston market",
    promptTitle: "My weekend plans include..",
    text: "Going down to the Reservoir and hoping to pet at least five golden retrievers.",
    likes: 256,
    userName: "Tim O.",
    school: "Boston College",
    commentsCount: 1,
    trophyText: "Top Market Response wins a free dinner date",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#4 MIT",
    subtitle: "Boston market",
    promptTitle: "What's your ideal first date",
    text: "Museum of Science after hours, then hot chocolate by the Charles.",
    likes: 234,
    userName: "Priya N.",
    school: "MIT",
    commentsCount: 6,
    trophyText: "Top Market Response wins a free dinner date",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#5 Northeastern",
    subtitle: "Boston market",
    promptTitle: "My absolute go-to snack is..",
    text: "Everything bagel with scallion cream cheese from the food truck on Huntington.",
    likes: 198,
    userName: "Chris M.",
    school: "Northeastern",
    commentsCount: 0,
    trophyText: "Top Market Response wins a free dinner date",
    avatarSrc: "/images/ron-avatar.png",
  },
];

const nationalTemplates: Omit<ResponseItem, "id">[] = [
  {
    rank: "#1 NYU",
    subtitle: "National ranking",
    promptTitle: "What's your ideal first date",
    text: "A ride on the ferry at sunset, then getting street tacos. Dynamic views and delicious food make conversations flow so easily.",
    likes: 1245,
    userName: "Ethan G.",
    school: "NYU",
    commentsCount: 18,
    trophyText: "National Winner gets featured on the App Store frontpage",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#2 UCLA",
    subtitle: "National ranking",
    promptTitle: "A random fact I love is..",
    text: 'The Hollywood sign originally said "Hollywoodland" and was just a temporary real estate billboard.',
    likes: 982,
    userName: "Chloe V.",
    school: "UCLA",
    commentsCount: 12,
    trophyText: "National Winner gets featured on the App Store frontpage",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#3 Stanford",
    subtitle: "National ranking",
    promptTitle: "My absolute go-to snack is..",
    text: "Frozen grapes rolled in lime juice and sugar. It literally tastes like Sour Patch Kids but healthy.",
    likes: 843,
    userName: "Marcus Y.",
    school: "Stanford",
    commentsCount: 8,
    trophyText: "National Winner gets featured on the App Store frontpage",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#4 Michigan",
    subtitle: "National ranking",
    promptTitle: "My favorite local spot is..",
    text: "The diag at golden hour — nothing beats it for people-watching and deep talks.",
    likes: 756,
    userName: "Taylor W.",
    school: "University of Michigan",
    commentsCount: 9,
    trophyText: "National Winner gets featured on the App Store frontpage",
    avatarSrc: "/images/ron-avatar.png",
  },
  {
    rank: "#5 UT Austin",
    subtitle: "National ranking",
    promptTitle: "My weekend plans include..",
    text: "Barton Springs, live music on South Congress, and breakfast tacos at dawn.",
    likes: 712,
    userName: "Riley H.",
    school: "UT Austin",
    commentsCount: 7,
    trophyText: "National Winner gets featured on the App Store frontpage",
    avatarSrc: "/images/ron-avatar.png",
  },
];

function expandTemplates(
  scope: ResponseScope,
  templates: Omit<ResponseItem, "id">[],
): ResponseItem[] {
  const items: ResponseItem[] = [];
  for (let batch = 0; batch < 3; batch++) {
    templates.forEach((template, index) => {
      items.push({
        ...template,
        id: `${scope}-${batch * templates.length + index + 1}`,
        likes: Math.max(120, template.likes - batch * 28 - index * 7),
      });
    });
  }
  return items;
}

export const responsesData: Record<ResponseScope, ResponseItem[]> = {
  school: expandTemplates("school", schoolTemplates),
  market: expandTemplates("market", marketTemplates),
  national: expandTemplates("national", nationalTemplates),
};
