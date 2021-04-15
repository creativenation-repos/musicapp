import React, { useEffect } from "react";

import TopBar from "../Dash/TopBar";
import DashFooter from "../Dash/DashFooter";

import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ArticleBlock from "./ArticleBlock";

export default function ArticlesMain() {
  const teacherAuthID = useSelector((state) => state.storeTeacherAuthIDReducer);
  const history = useHistory();

  const articleState = useSelector(
    (state) => state.storeTeacherArticlesGeneralInfoReducer
  );

  useEffect(() => {
    if (!teacherAuthID) {
      history.push("/teacherdash");
      return;
    }
  }, []);

  return (
    <div>
      {/* Top Bar */}
      <div>
        <TopBar />
      </div>

      {/* Content */}
      <div>
        <div>
          <input id="tbArticleSearch" type="text" placeholder="Search" />
          <button>Create New Article</button>
        </div>
        <div>
          {articleState.map((art, i) => {
            return (
              <ArticleBlock key={i} mainTopic={art.MainTopic} desc={art.Desc} />
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div>
        <DashFooter />
      </div>
    </div>
  );
}
