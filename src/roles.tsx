import React, { useEffect, useState } from "react";

type Moderator = {
  id: string;
  login: string;
  displayName: string;
  description?: string;
  language?: string;
  avatar: string;
  followers: number;
  createdAt: string;
  updatedAt: string;
  isAffiliate: boolean;
  isPartner: boolean;
  isStaff: boolean;
  isBanned: boolean;
};

type APIResponse = {
  total: number;
  page: number;
  pages: number;
  perPage: number;
  cursor?: string;
  data: Moderator[];
};

const AllModerators: React.FC = () => {
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllModerators = async () => {
    const allData: Moderator[] = [];
    let cursor: string | undefined = undefined;

    try {
      while (true) {
        const url = new URL("https://roles.tv/api/stats/user/moderators/login/feelssunnyman");
        if (cursor) url.searchParams.append("cursor", cursor);

        const response = await fetch(url.toString());
        const json: APIResponse = await response.json();
        console.log(json)
        allData.push(...json.data);
        if (!json.cursor || json.data.length < json.perPage) break;
        cursor = json.cursor;
      }

      setModerators(allData);
    } catch (err) {
      console.error("Failed to fetch moderator data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllModerators();
  }, []);

  if (loading) return <p>Loading moderators...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-slate-50">Moderators for feelssunnyman</h2>
      <ul>
        {moderators.map((mod) => (
          <li key={mod.id} className="mb-2 text-slate-200">
            <img src={mod.avatar} alt={mod.displayName} className="inline-block w-8 h-8 mr-2 rounded-full" />
            <strong>{mod.displayName}</strong> ({mod.login}) - {mod.followers.toLocaleString()} followers
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllModerators;
