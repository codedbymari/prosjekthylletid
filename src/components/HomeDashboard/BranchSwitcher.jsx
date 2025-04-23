import { FiChevronDown, FiChevronUp, FiCheck } from 'react-icons/fi';

const BranchSwitcher = ({ currentBranch, showBranchMenu, setShowBranchMenu, mockBranches, handleBranchChange }) => (
  <div className="branch-switcher">
    <button 
      className="branch-button" 
      onClick={() => setShowBranchMenu(!showBranchMenu)}
      aria-label="Bytt filial"
      aria-expanded={showBranchMenu}
    >
      <div className="branch-info">
        <span className="branch-name">{currentBranch.name}</span>
        <span className="branch-address">{currentBranch.address}</span>
      </div>
      {showBranchMenu ? 
        <FiChevronUp className="dropdown-icon open" /> : 
        <FiChevronDown className="dropdown-icon" />
      }
    </button>

    {showBranchMenu && (
      <div className="branch-menu">
        {mockBranches.map(branch => (
          <button 
            key={branch.id}
            className={`branch-menu-item ${branch.id === currentBranch.id ? 'active' : ''}`}
            onClick={() => handleBranchChange(branch)}
            style={{
              '--item-color': branch.theme,
              '--item-bg': `${branch.theme}1A`
            }}
          >
            <div className="branch-menu-info">
              <span>{branch.name}</span>
              <span>{branch.address}</span>
            </div>
            {branch.id === currentBranch.id && <FiCheck className="active-check" />}
          </button>
        ))}
      </div>
    )}
  </div>
);

export default BranchSwitcher;
